import Particles from "react-tsparticles";

function Background() {

  return (

    <Particles
      options={{
        fullScreen: {
          enable: true,
          zIndex: -1,
        },
        particles: {
          number: {
            value: 60,
            density: {
              enable: true,
              area: 800,
            },
          },
          color: {
            value: ["#00f2fe", "#4facfe", "#a01eff"],
          },
          shape: {
            type: "circle",
          },
          opacity: {
            value: 0.2,
            random: true,
            anim: {
              enable: true,
              speed: 1,
              opacity_min: 0.1,
              sync: false,
            },
          },
          size: {
            value: 2,
            random: true,
          },
          links: {
            enable: true,
            distance: 150,
            color: "#00f2fe",
            opacity: 0.1,
            width: 1,
          },
          move: {
            enable: true,
            speed: 0.8,
            direction: "none",
            random: true,
            straight: false,
            outModes: "out",
          },
        },
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "grab",
            },
          },
          modes: {
            grab: {
              distance: 200,
              links: {
                opacity: 0.4,
              },
            },
          },
        },
        background: {
          color: "#03040b",
        },
      }}
    />

  );
}

export default Background;