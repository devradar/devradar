<template>
  <div>
    <div>
      {{ blips }}
    </div>
      <div class="radar">
        <div class="xline"></div>
        <div class="yline"></div>
      <div id="blips"></div>

      <div class="q1"><h3>Cloud Technologies</h3></div>
      <div class="q2"><h3>Tools</h3></div>
      <div class="q3"><h3>Datascience</h3></div>
      <div class="q4"><h3>Backend</h3></div>

      <div class="adopt"></div>
      <div class="trial"></div>
      <div class="assess"></div>
      <div class="hold"></div>
    </div>

  </div>
</template>

<script>
export default {
  computed: {
    blips () {
      return this.$store.getters.loadedBlips
    }
  },
  data: () => ({
  })
}
</script>

<style lang="scss" scoped>
// Area (blip) colors
$q1: #0096A4;
$q2: #7DB58D;
$q3: #EC7632;
$q4: #A13F52;

.radar {
  .xline {
    content: '';
    width: 110%;
    height: 1px;
    background: rgba(lighten(black, 55%), .4);
    position: absolute;
    left: -5%;
    top: 50%;
    z-index: 100;
  }
  .yline {
    content: '';
    height: 110%;
    width: 1px;
    background: rgba(lighten(black, 55%), .4);
    position: absolute;
    left: 50%;
    top: -5%;
    z-index: 100;
  }
}

.radar {
  width: 60em;
  height: 60em;
  margin: 0 auto;
  margin-top: 4rem;
  background: lighten(black, 95%);
  border-radius: 50%;
  position: relative;
  margin-bottom: 4em;
}

.radar {
  .q1 {
    color: $q1;
    left: -3em;
    top: 0;
    position: absolute;
  }
  .q2 {
    color: $q2;
    right: -3em;
    top: 0;
    position: absolute;
  }
  .q3 {
    color: $q3;
    left: -3em;
    bottom: 0;
    position: absolute;
  }
  .q4 {
    color: $q4;
    right: -3em;
    bottom: 0;
    position: absolute;
  }
}

.q1 {
  z-index: 100;
  header {
    background: $q1;
    color: white;
  }
  ul {
    li {
      a {
        color: $q1;
      }
    }
  }
}

.q2 {
  z-index: 100;
  header {
    background: $q2;
    color: white;
  }
  ul {
    li {
      a {
        color: $q2;
      }
    }
  }
}

.q3 {
  z-index: 100;
  header {
    background: $q3;
    color: white;
  }
  ul {
    li {
      a {
        color: $q3;
      }
    }
  }
}

.q4 {
  z-index: 100;
  header {
    background: $q4;
    color: white;
  }
  ul {
    li {
      a {
        color: $q4;
      }
    }
  }
}

.radar {
  &:before {
    content: 'Hold';
    font-size: .6em;
    text-transform: uppercase;
    position: absolute;
    top: -30px;
    left: 0;
    right: 0;
    margin: 0 auto;
    display: block;
    text-align: center;
  }
}

.adopt {
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto;
  top: 35%;
  width: 30%;
  height: 30%;
  border-radius: 50%;
  border: 2px solid white;
  background: lighten(black, 85%);
  z-index: 3;
  &:before {
    content: 'Adopt';
    font-size: .6em;
    text-transform: uppercase;
    position: absolute;
    top: -30px;
    left: 0;
    right: 0;
    margin: 0 auto;
    display: block;
    text-align: center;
  }
}

.trial {
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto;
  top: 20%;
  width: 60%;
  height: 60%;
  border-radius: 50%;
  border: 2px solid white;
  background: lighten(black, 90%);
  z-index: 2;
  &:before {
    content: 'Trial';
    font-size: .6em;
    text-transform: uppercase;
    position: absolute;
    top: -30px;
    left: 0;
    right: 0;
    margin: 0 auto;
    display: block;
    text-align: center;
  }
}

.assess {
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto;
  top: 10%;
  width: 80%;
  height: 80%;
  border-radius: 50%;
  border: 2px solid white;
  background: lighten(black, 92%);
  &:before {
    content: 'Assess';
    font-size: .6em;
    text-transform: uppercase;
    position: absolute;
    top: -30px;
    left: 0;
    right: 0;
    margin: 0 auto;
    display: block;
    text-align: center;
  }
}

</style>
