// LocalStorage-based data layer (no backend required)

const KEYS = {
  USERS: 'interntrack_users',
  CURRENT_USER: 'interntrack_current_user',
  APPLICATIONS: 'interntrack_applications',
  INTERVIEWS: 'interntrack_interviews',
  REMINDERS: 'interntrack_reminders',
};

function get(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function set(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function nextId(items) {
  if (!items.length) return 1;
  return Math.max(...items.map((i) => i.id || 0)) + 1;
}

// ─── Auth ───────────────────────────────────────────────
export const authStorage = {
  register({ name, email, password, phone }) {
    const users = get(KEYS.USERS, []);
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('Email already registered');
    }
    const user = {
      id: nextId(users),
      name,
      email,
      password, // plain for demo only – never do this in production
      phone: phone || null,
      role: 'USER',
      createdAt: new Date().toISOString(),
    };
    users.push(user);
    set(KEYS.USERS, users);
    const { password: _, ...safe } = user;
    set(KEYS.CURRENT_USER, safe);
    return safe;
  },

  login({ email, password }) {
    const users = get(KEYS.USERS, []);
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!user) throw new Error('Invalid email or password');
    const { password: _, ...safe } = user;
    set(KEYS.CURRENT_USER, safe);
    return safe;
  },

  logout() {
    localStorage.removeItem(KEYS.CURRENT_USER);
  },

  getCurrentUser() {
    return get(KEYS.CURRENT_USER, null);
  },
};

// ─── Applications ───────────────────────────────────────
export const applicationStorage = {
  getAll(userId, search = '') {
    let apps = get(KEYS.APPLICATIONS).filter((a) => a.userId === userId);
    if (search && search.trim()) {
      const q = search.toLowerCase();
      apps = apps.filter(
        (a) =>
          a.companyName?.toLowerCase().includes(q) ||
          a.jobTitle?.toLowerCase().includes(q) ||
          a.location?.toLowerCase().includes(q)
      );
    }
    return apps.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getById(id, userId) {
    const app = get(KEYS.APPLICATIONS).find((a) => a.id === Number(id) && a.userId === userId);
    if (!app) throw new Error('Application not found');
    return app;
  },

  create(userId, data) {
    const apps = get(KEYS.APPLICATIONS);
    const app = {
      id: nextId(apps),
      userId,
      companyName: data.companyName,
      jobTitle: data.jobTitle,
      jobType: data.jobType || 'INTERNSHIP',
      location: data.location || '',
      salary: data.salary || '',
      jobUrl: data.jobUrl || '',
      description: data.description || '',
      applicationDate: data.applicationDate || null,
      deadline: data.deadline || null,
      status: data.status || 'SAVED',
      priority: data.priority || 'MEDIUM',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    apps.push(app);
    set(KEYS.APPLICATIONS, apps);
    return app;
  },

  update(id, userId, data) {
    const apps = get(KEYS.APPLICATIONS);
    const idx = apps.findIndex((a) => a.id === Number(id) && a.userId === userId);
    if (idx === -1) throw new Error('Application not found');
    apps[idx] = {
      ...apps[idx],
      ...data,
      id: apps[idx].id,
      userId,
      updatedAt: new Date().toISOString(),
    };
    set(KEYS.APPLICATIONS, apps);
    return apps[idx];
  },

  updateStatus(id, userId, status) {
    return this.update(id, userId, { status });
  },

  delete(id, userId) {
    let apps = get(KEYS.APPLICATIONS);
    apps = apps.filter((a) => !(a.id === Number(id) && a.userId === userId));
    set(KEYS.APPLICATIONS, apps);
    // cascade delete related interviews
    let interviews = get(KEYS.INTERVIEWS);
    interviews = interviews.filter((i) => i.applicationId !== Number(id));
    set(KEYS.INTERVIEWS, interviews);
  },
};

// ─── Interviews ─────────────────────────────────────────
export const interviewStorage = {
  getAll(userId) {
    const apps = applicationStorage.getAll(userId);
    const appIds = new Set(apps.map((a) => a.id));
    return get(KEYS.INTERVIEWS)
      .filter((i) => appIds.has(i.applicationId))
      .map((i) => {
        const app = apps.find((a) => a.id === i.applicationId);
        return {
          ...i,
          companyName: app?.companyName,
          jobTitle: app?.jobTitle,
        };
      })
      .sort((a, b) => new Date(a.interviewDate) - new Date(b.interviewDate));
  },

  getUpcoming(userId) {
    const now = new Date();
    return this.getAll(userId).filter((i) => new Date(i.interviewDate) >= now);
  },

  create(userId, data) {
    // verify ownership
    applicationStorage.getById(data.applicationId, userId);
    const interviews = get(KEYS.INTERVIEWS);
    const interview = {
      id: nextId(interviews),
      applicationId: Number(data.applicationId),
      interviewDate: data.interviewDate,
      interviewType: data.interviewType || 'TECHNICAL',
      meetingLink: data.meetingLink || '',
      interviewerName: data.interviewerName || '',
      notes: data.notes || '',
      status: 'SCHEDULED',
      createdAt: new Date().toISOString(),
    };
    interviews.push(interview);
    set(KEYS.INTERVIEWS, interviews);

    // auto-update application status
    try {
      const app = applicationStorage.getById(data.applicationId, userId);
      if (app.status !== 'SELECTED' && app.status !== 'REJECTED') {
        applicationStorage.updateStatus(data.applicationId, userId, 'INTERVIEW');
      }
    } catch {}

    const apps = applicationStorage.getAll(userId);
    const app = apps.find((a) => a.id === interview.applicationId);
    return { ...interview, companyName: app?.companyName, jobTitle: app?.jobTitle };
  },

  delete(id, userId) {
    const all = this.getAll(userId);
    if (!all.find((i) => i.id === Number(id))) throw new Error('Interview not found');
    let interviews = get(KEYS.INTERVIEWS);
    interviews = interviews.filter((i) => i.id !== Number(id));
    set(KEYS.INTERVIEWS, interviews);
  },
};

// ─── Reminders ──────────────────────────────────────────
export const reminderStorage = {
  getAll(userId) {
    return get(KEYS.REMINDERS)
      .filter((r) => r.userId === userId)
      .sort((a, b) => new Date(a.reminderDate) - new Date(b.reminderDate));
  },

  getPending(userId) {
    return this.getAll(userId).filter((r) => !r.isCompleted);
  },

  create(userId, data) {
    const reminders = get(KEYS.REMINDERS);
    const reminder = {
      id: nextId(reminders),
      userId,
      applicationId: data.applicationId || null,
      title: data.title,
      description: data.description || '',
      reminderDate: data.reminderDate,
      isCompleted: false,
      createdAt: new Date().toISOString(),
    };
    reminders.push(reminder);
    set(KEYS.REMINDERS, reminders);
    return reminder;
  },

  complete(id, userId) {
    const reminders = get(KEYS.REMINDERS);
    const idx = reminders.findIndex((r) => r.id === Number(id) && r.userId === userId);
    if (idx === -1) throw new Error('Reminder not found');
    reminders[idx].isCompleted = true;
    set(KEYS.REMINDERS, reminders);
    return reminders[idx];
  },

  delete(id, userId) {
    let reminders = get(KEYS.REMINDERS);
    reminders = reminders.filter((r) => !(r.id === Number(id) && r.userId === userId));
    set(KEYS.REMINDERS, reminders);
  },
};

// ─── Analytics ──────────────────────────────────────────
export const analyticsStorage = {
  getOverview(userId) {
    const apps = applicationStorage.getAll(userId);
    const total = apps.length;
    const applied = apps.filter((a) => a.status === 'APPLIED').length;
    const interviews = apps.filter((a) => a.status === 'INTERVIEW').length;
    const selected = apps.filter((a) => a.status === 'SELECTED').length;
    const rejected = apps.filter((a) => a.status === 'REJECTED').length;
    const shortlisted = apps.filter((a) => a.status === 'SHORTLISTED').length;

    return {
      totalApplications: total,
      applied,
      interviews,
      selected,
      rejected,
      shortlisted,
      interviewRate: total ? Math.round((interviews * 1000) / total) / 10 : 0,
      selectionRate: total ? Math.round((selected * 1000) / total) / 10 : 0,
      rejectionRate: total ? Math.round((rejected * 1000) / total) / 10 : 0,
    };
  },
};
