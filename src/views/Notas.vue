<template>
  <div class="container">
    <b-alert
      :show="dismissCountDown"
      dismissible
      :variant="mensaje.color"
      @dismissed="dismissCountDown = 0"
      @dismiss-count-down="countDownChanged"
    >
      {{ mensaje.texto }}
    </b-alert>

    <form @submit.prevent="agregarNota(nota)" v-if="agregar">
      <h3 class="text-center">Agregar nueva Nota</h3>
      <input
        type="text"
        placeholder="Ingrese un Nombre"
        class="form-control my-2"
        v-model="nota.nombre"
      />
      <input
        type="text"
        placeholder="Ingrese una descripcion"
        class="form-control my-2"
        v-model="nota.descripcion"
      />
      <b-button class="btn-sm btn-block btn-success" type="submit"
        >Agregar</b-button
      >
    </form>

    <form @submit.prevent="editarNota(notaEditar)" v-else>
      <h3 class="text-center">Editar Nota</h3>
      <input
        type="text"
        placeholder="Ingrese un Nombre"
        class="form-control my-2"
        v-model="notaEditar.nombre"
      />
      <input
        type="text"
        placeholder="Ingrese una descripcion"
        class="form-control my-2"
        v-model="notaEditar.descripcion"
      />
      <b-button class="btn-sm btn-block mb-1 btn-warning" type="submit"
        >Editar</b-button
      >
      <b-button class="btn-sm btn-block" @click="agregar = true"
        >Cancelar</b-button
      >
    </form>

    <table class="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Nombre</th>
          <th scope="col">Descripción</th>
          <th scope="col">Fecha</th>
          <th scope="col">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in notas" :key="index">
          <th scope="row">{{ item._id }}</th>
          <td>{{ item.nombre }}</td>
          <td>{{ item.descripcion }}</td>
          <td>{{ item.date }}</td>
          <td>
            <b-button
              class="btn-warning btn-sm mx-2"
              @click="activarEdicion(item._id)"
              >Actualizar</b-button
            >
            <b-button
              class="btn-danger btn-sm mx-2"
              @click="eliminarNota(item._id)"
              >Eliminar</b-button
            >
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Notas",

  data() {
    return {
      notas: [],
      mensaje: { color: "success", texto: "" },
      dismissSecs: 5,
      dismissCountDown: 0,
      nota: {
        nombre: "",
        descripcion: "",
      },
      notaEditar: {
        id: "",
        nombre: "",
        descripcion: "",
      },
      agregar: true,
    };
  },

  computed: {
    ...mapState(["token"]),
  },

  created() {
    this.getData();
  },

  methods: {
    getData() {
      let config = {
        headers: {
          token: this.token,
        },
      };
      this.axios
        .get("/nota", config)
        .then((res) => {
          console.log(res);
          this.notas = res;
        })
        .catch((error) => console.log(error));
    },

    agregarNota() {
      let config = {
        headers: {
          token: this.token,
        },
      };
      this.axios
        .post("/nueva-nota", this.nota, config)
        .then((res) => {
          this.notas.push(res.data);
          this.nota.nombre = "";
          this.nota.descripcion = "";
          this.mensaje.color = "success";
          this.mensaje.texto = "Tarea agregada";
          this.showAlert();
          console.log(res);
        })
        .catch((error) => {
          this.showAlert();
          this.mensaje.color = "danger";
          this.mensaje.texto = e.response.data.error.errors.nombre.message;
        });
    },

    activarEdicion(id) {
      this.agregar = false;
      this.axios
        .get(`/nota/${id}`)
        .then((res) => {
          this.nota.nombre = res.data.nombre;
          this.nota.descripcion = res.data.descripcion;
        })
        .catch((error) => console.log(error));
    },

    editarNota(item) {
      this.axios
        .put(`nota/${item.id}`, item)
        .then((res) => {
          const index = this.notas.findIndex((n) => n.id === item.id);
          this.notas[index].nombre = res.data.nombre;
          this.notas[index].descripcion = res.data.descripcion;
          this.mensaje.color = "success";
          this.mensaje.texto = "Tarea Editada";
          this.showAlert();
          this.getData();
        })
        .catch((error) => {
          console.log(error);
        });
    },

    eliminarNota(id) {
      this.axios
        .delete(`nota/${id}`)
        .then((res) => {
          // borrar el id que sea igual al id que se borra
          const eliminar = this.notas.findIndex(
            (item) => item.id === res.data.id
          );
          this.notas.splice(eliminar, 1);
          this.mensaje.color = "success";
          this.mensaje.texto = "Tarea Elimnada";
          this.showAlert();
        })
        .catch((error) => {
          console.log(error);
        });
    },

    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },

    showAlert() {
      this.dismissCountDown = this.dismissSecs;
    },
  },
};
</script>

<style>
</style>