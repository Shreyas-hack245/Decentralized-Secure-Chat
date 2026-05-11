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
            value: 45,
          },

          color: {
            value: "#7c3aed",
          },

          links: {

            enable: true,

            color: "#38bdf8",

            distance: 150,
          },

          move: {
            enable: true,
            speed: 1.5,
          },

          size: {
            value: 3,
          },

          opacity: {
            value: 0.5,
          },

        },

        background: {
          color: "#020617",
        },

      }}

    />

  );
}

export default Background;