let applied = false;

window.Mocks = {
  insertSaveMockButton: function(target) {
    if (applied) return;

    if (!target) {
      return console.error("insertSaveMockButton: Target required"); //eslint-disable-line no-console
    }

    var button = document.createElement("button");
    button.innerText = "Save Mock";
    button.style.position = "absolute";
    button.style.bottom = 0;
    button.onclick = function() {
      fetch(`/mocks/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify({
          name: `${window.vue.$store.state.route.name}-${Date.now()}`,
          data: {
            state: window.vue.$store.state
          }
        })
      }).then(() => alert(`Saved`));
    };

    if (!target.style.position || target.style.position === "static") {
      target.style.position = "relative";
    }

    target.appendChild(button);
  },

  applyMock: function(storeConfig) {
    const mockName = new URL(location.href).searchParams.get("mock");

    if (mockName) {
      const mockData = require(`./data/${mockName}.json`);

      if (mockData) {
        applied = true;
        Object.assign(storeConfig.state, mockData.state);
        storeConfig.mutations = {};
        return;
      }
    }

    console.warn("Mock wasn't applied"); //eslint-disable-line no-console
  },

  applied: function() {
    return applied;
  }
};
