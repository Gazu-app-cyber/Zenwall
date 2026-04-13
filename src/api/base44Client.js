const STORAGE_KEYS = {
  users: "zenwall_users",
  currentUser: "zenwall_current_user",
  folders: "zenwall_folders",
  saved: "zenwall_saved_wallpapers",
};

function read(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
}

function createId(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now()}`;
}

function filterBy(data, query = {}) {
  return data.filter((item) => Object.entries(query).every(([key, value]) => item[key] === value));
}

function getUsers() {
  return read(STORAGE_KEYS.users, []);
}

function setUsers(users) {
  write(STORAGE_KEYS.users, users);
}

function getCurrentUser() {
  return read(STORAGE_KEYS.currentUser, null);
}

function setCurrentUser(user) {
  write(STORAGE_KEYS.currentUser, user);
}

function getCollection(key) {
  return read(key, []);
}

function setCollection(key, value) {
  write(key, value);
}

function updateCollectionRecord(key, record) {
  const collection = getCollection(key);
  const next = collection.some((item) => item.id === record.id)
    ? collection.map((item) => (item.id === record.id ? record : item))
    : [record, ...collection];
  setCollection(key, next);
  return record;
}

export const base44 = {
  auth: {
    signup({ email, password, full_name }) {
      const users = getUsers();
      const existing = users.find((item) => item.email.toLowerCase() === email.toLowerCase());
      if (existing) throw new Error("EMAIL_ALREADY_EXISTS");
      const user = {
        id: createId("user"),
        email: email.trim().toLowerCase(),
        password,
        full_name: full_name?.trim() || "",
        is_premium: false,
        created_at: new Date().toISOString(),
      };
      setUsers([user, ...users]);
      setCurrentUser(user);
      return user;
    },
    login({ email, password }) {
      const user = getUsers().find(
        (item) => item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password
      );
      if (!user) throw new Error("INVALID_CREDENTIALS");
      setCurrentUser(user);
      return user;
    },
    logout(path = "/") {
      setCurrentUser(null);
      if (typeof window !== "undefined") {
        window.location.assign(path);
      }
    },
    getCurrentUser,
  },
  entities: {
    User: {
      upsert(record) {
        const users = getUsers();
        const next = users.some((user) => user.id === record.id || user.email === record.email)
          ? users.map((user) =>
              user.id === record.id || user.email === record.email ? { ...user, ...record } : user
            )
          : [{ ...record, id: record.id || createId("user") }, ...users];
        setUsers(next);
        const current = getCurrentUser();
        if (current && current.email === record.email) {
          setCurrentUser(next.find((user) => user.email === record.email) || null);
        }
        return record;
      },
      delete(userId) {
        setUsers(getUsers().filter((user) => user.id !== userId));
      },
    },
    Folder: {
      filter(query) {
        return filterBy(getCollection(STORAGE_KEYS.folders), query);
      },
      create(payload) {
        const record = { id: createId("folder"), created_at: new Date().toISOString(), ...payload };
        return updateCollectionRecord(STORAGE_KEYS.folders, record);
      },
      delete(id) {
        setCollection(
          STORAGE_KEYS.folders,
          getCollection(STORAGE_KEYS.folders).filter((item) => item.id !== id)
        );
        setCollection(
          STORAGE_KEYS.saved,
          getCollection(STORAGE_KEYS.saved).map((item) =>
            item.folder_id === id ? { ...item, folder_id: "all" } : item
          )
        );
      },
    },
    SavedWallpaper: {
      filter(query) {
        return filterBy(getCollection(STORAGE_KEYS.saved), query);
      },
      create(payload) {
        const saved = getCollection(STORAGE_KEYS.saved);
        const exists = saved.find(
          (item) => item.user_email === payload.user_email && item.wallpaper_id === payload.wallpaper_id
        );
        if (exists) return exists;
        const record = {
          id: createId("saved"),
          created_at: new Date().toISOString(),
          folder_id: payload.folder_id || "all",
          ...payload,
        };
        return updateCollectionRecord(STORAGE_KEYS.saved, record);
      },
      delete(id) {
        setCollection(
          STORAGE_KEYS.saved,
          getCollection(STORAGE_KEYS.saved).filter((item) => item.id !== id)
        );
      },
    },
  },
};
