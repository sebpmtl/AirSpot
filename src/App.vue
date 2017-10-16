
<template>
  <v-app id="previsions">
    <v-toolbar>
      <v-toolbar-title>AirSpot</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-icon v-on:click="reload">
        fa fa-refresh fa-2x
      </v-icon>
    </v-toolbar>
    <main>
      <v-content>
        <v-card>
          <v-card-title>
            <v-flex>
              <h1 class="text-xs-center">Montreal</h1>

              <h2 class="text-xs-center">
                <date v-bind:month="month"></date>
                <date v-bind:day="day"></date>
                <date v-bind:year="year"></date>

              </h2>
              <h3 class=" text-xs-center">
                <i>Issued at
                  <issued v-bind:hour="hour">
                  </issued>
                </i>
              </h3>
            </v-flex>
          </v-card-title>

        </v-card>
        <v-card>
          <v-flex>
            <h4 class="text-xs-center">Air Quality Index(
              <u v-bind:title="aqiDef">AQI</u>)</h4>
          </v-flex>
          <v-layout row>

            <v-flex xs6>
              <v-card-media>
                <v-layout justify-space-around>
                  <v-icon x-large class="pt-4" style="font-size:80px">fa-globe</v-icon>
                </v-layout>

              </v-card-media>
            </v-flex>

            <v-flex xs6 class="subheading">

              <p>North:
                <prevs v-bind:north="north"></prevs>
              </p>
              <p>Downtown:
                <prevs v-bind:down="down"></prevs>
              </p>
              <p>East:
                <prevs v-bind:east="east"></prevs>
              </p>
              <p>West:
                <prevs v-bind:west="west"></prevs>
              </p>

            </v-flex>
          </v-layout>
        </v-card>

        <div class="text-xs-center">
          <v-btn small color="green">
            <b>1-25</b>
          </v-btn>
          <v-btn small color="yellow">
            <b>26-50</b>
          </v-btn>
          <v-btn small color="red">
            <b>51+</b>
          </v-btn>
        </div>

      </v-content>
    </main>

  </v-app>
</template>

<script>
export default {
  name: 'previsions',
  data: function() {

    return {

      month: '',
      day: '',
      year: '',
      north: '',
      down: '',
      east: '',
      west: '',
      hour: '',
      aqiDef: 'The AQI is an index for reporting daily air quality. It tells you how clean or polluted your air is and what associated health effects.',

    }


  },



  components: {
    'date': {
      props: ['day', 'year', 'month'],
      template: '<b >{{ month }} {{ day }} {{ year }}</b>'


    },
    'prevs': {
      props: ['north', 'down', 'east', 'west'],
      template: '<b v-bind:class="[bareme()]">{{ north }} {{ down }} {{ east }} {{ west }}</b>',
      methods: {
        bareme: function() {
          if ((this.north || this.down || this.east || this.west) < 26) {
            return 'bareme1'
          }
          else if ((this.north || this.down || this.east || this.west) < 51) {
            return 'bareme2'
          }

          else {
            return 'bareme3'
          }

        }
      }
    },
    'issued': {
      props: ['hour'],
      template: '<span class="headline">{{ hour }}</span>'

    }
  },

  beforeMount() {
    this.getXMLDoc()

  },


  methods: {

    getXMLDoc: function() {
      this.$http.get('https://cors-anywhere.herokuapp.com/http://ville.montreal.qc.ca/rsqa/servlet/makeXmlActuel').then(response => {

        this.toJSON(response.body);
      }, response => {

        throw new Error("Couldn't load document.");

      });

    },
    toJSON: function(xmlDoc) {
      let parser = new DOMParser();
      let doc = parser.parseFromString(xmlDoc, "application/xml");
      let conv = xmlToJson(doc);
      let annee = conv.iqa.journee["@attributes"].annee;
      let jour = conv.iqa.journee["@attributes"].jour;
      let mois = conv.iqa.journee["@attributes"].mois;
      let north = conv.iqa.indice_secteur.secteur[0]["@attributes"].value;
      let down = conv.iqa.indice_secteur.secteur[1]["@attributes"].value;
      let east = conv.iqa.indice_secteur.secteur[2]["@attributes"].value;
      let west = conv.iqa.indice_secteur.secteur[3]["@attributes"].value;
      let issued = conv.iqa.journee.station[0].echantillon.length - 1;
      let hours = new Date().getHours();
      let hourEng = (hours < 12) ? hours + ":00am" : (hours == 12) ? hours + ":00pm" : hours % 12 + ":00pm";
      let monthStr = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November',
        'December'];
      this.month = monthStr[mois - 1];
      this.year = annee;
      this.day = jour;
      this.north = north;
      this.down = down;
      this.east = east;
      this.west = west;
      this.hour = hourEng;
      console.log(conv);
      console.log(issued);
      console.log(hourEng);

    },

    reload: function() {
      window.location.reload(true);
    },



  }

}

</script>
<style lang="css" scoped>
.bareme1 {
  color: green;
}

.bareme2 {
  color: yellow;
}

.bareme3 {
  color: red;
}
</style>