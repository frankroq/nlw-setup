import Fastify from "fastify";
import cors from "@fastify/cors"
import { appRoutes } from "./routes";

const app = Fastify();

app.register(cors)
app.register(appRoutes)
app.listen({
    host: '10.0.0.169',
    port: 3333
}).then(()=>{
    console.log('Server running!')
})