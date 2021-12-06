<template>
  <div class="container">
    <h1>Login</h1>
    <form @submit.prevent="login">
      <input
        type="text"
        class="form-control my-2"
        placeholder="Email"
        v-model="usuario.email"
      />
      <input
        type="password"
        class="form-control my-2"
        placeholder="Pass"
        v-model="usuario.pass"
      />
      <b-button type="submit">Acceder</b-button>
    </form>
    <div v-if="mensaje !== ''">
      <p>{{ mensaje }}</p>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "auth",
  data() {
    return {
      mensaje: "",
      usuario: {
        email: "",
        pass: "",
      },
    };
  },
  methods: {
    ...mapActions(["authUser"]),
    login() {
      this.axios
        .post("/login", this.usuario)
        .then((res) => {
          console.log(res.data);
          // authUser espera un payload o token, que esta en la data
          const token = res.data.token;
          this.authUser(token);
        })
        .error((e) => {
          this.mensaje = e.response.data.mensaje;
          e.response;
        });
    },
  },
};
</script>

<style>
</style>