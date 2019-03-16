const STATES = ["default", "running"];

const favicon = {
  setState(state) {
    if (STATES.includes(state)) {
      favicon.applyState[state]();
    } else {
      console.error("Favicon.setState: invalid argument"); // eslint-disable-line no-console
    }
  },

  setIcon(href) {
    const currentLink = document.getElementById("favicon");
    const head = currentLink.parentNode;

    const nextLink = document.createElement("link");
    nextLink.setAttribute("href", href);
    nextLink.setAttribute("rel", "icon");
    nextLink.setAttribute("type", "image/png");
    nextLink.setAttribute("id", "favicon");

    head.removeChild(currentLink);
    head.appendChild(nextLink);
  },

  applyState: {
    default() {
      favicon.setIcon(
        "data:image/png;base64,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"
      );
    },

    running() {
      favicon.setIcon(
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACwElEQVRYw71XO2tUQRT+wAeJJmqhjRbRWPkCsUwhQRBFDfoLUptg5aOSBdFOlEUUcW2C8ReIWmgx5173oYUgG41FGgtjEQ3qGtQ8lE9m9homd+fuzl3vemGqOefMd17fORfw/PgSa6hwnII7VHhChUkKvlEwR8EUFcLoTst0IcuPCmcp+EwFep7vFIyxjL5sAAg2UzCRAsDfM09BnoKetA9up+BiRiBIwWsW0e/3+DPspsK0UQxwIzMQCrMMMdDK871G0FZsBqJehPcZIMcQwxScpuCa8TgJRFIkTJULXjkV3SDO8AU2JDoT4lACkDcsodfl/aWmIYyB8GzddRQ8dNREfqVgCXsoWGyZxwDXEx4ZpMIoBadYwbaGe4VqzNaCLnTb+5ue1TwWC/MxCt7HZBYpuKJTatkfdNgbtxlu1gtAiH1WtxygYKmJ/OVYiicayKqCbpiw+bXRTIwdwxbRWmIJWy35q46UDumL257hf75sjFhFwQ8PvZPLOgFGHPcFHYFHnhF4sKINfXQCjFj1MuxwKoA3swkqsRTMeNTMQSsCOYfNKW2o5hmBrxSstgDcbSE/zSrWW/LjDgBzMPPcl88DHLb6eyMF7xJkf1Fw1OKZXuNAo1wN0TLhO9WKsdbaZJYQwafo/qfOq27RWLpGE+y9hVFIN1rPJ0zRLbo7Uu0TgqcaXSHlWP3NABcyWmoKujqH2lwyilQ4YlOu9dh+KtyLz44GEIaIKug2tNjeklHfCRTKmic0WVHw0WufEHzhJNYmt0iWxw3inD3VdpgR+R9BuIok31EArUDo9cr8bHQeRC4ZRBH93rtBe+cDy9jZPBUhBjoCQndHiF1+pKEjkbxat3Oqeu9My1w9UWHO/8PDC2YMO8jKH0gZfeZHMw1Z6eEkuOUdcs+IdFFwIvoFD80UrY/yWpSux2a909SewuM/2U5mE0vDlDMAAAAASUVORK5CYII="
      );
    }
  }
};

export default favicon;
