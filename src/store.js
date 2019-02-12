const actions = {};

const register = (action, callback) => {
  actions[action] = actions[action] || [];
  actions[action].push(callback);
};

const unregister = action => {
  delete actions[action];
};

const publish = (action, data) => {
  actions[action].forEach(callback => {
    callback(data);
  });
};

const _store = {
  register,
  unregister,
  publish
};

const store = window.tb_store || _store;

export default store;
