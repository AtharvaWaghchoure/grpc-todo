const grpc = require("grpc");
const protoloader = require("@grpc/proto-loader");
const packageDef = protoloader.loadSync("todo.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

const text = process.argv.slice(2).join(" ");
// const text = process.argv.forEach(function (val, index, array) {
//   // console.log(index + ": ", +val);
//   var args = "";
//   if (val == " ") {
//         ""+
//   }
// });
const client = new todoPackage.Todo(
  "localhost:40000",
  grpc.credentials.createInsecure(),
);

client.createTodo(
  {
    id: -1,
    text: text,
  },
  (err, response) => {
    console.log("Received from server " + JSON.stringify(response));
  },
);

// client.readTodos(null, (err, response) => {
//   console.log("Received from server " + JSON.stringify(response));
//   if (response.items) {
//     response.items.forEach((a) => console.log(a.text));
//   }
// });

const call = client.readTodosStream();
call.on("data", (item) => {
  console.log("recieved item from server " + JSON.stringify(item));
});

call.on("end", (e) => console.log("server done!"));
