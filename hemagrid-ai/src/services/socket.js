import { io } from "socket.io-client";

const socket = io(
  "http://hemagrid-backend-env.eba-zutpubgp.us-east-1.elasticbeanstalk.com"
);

export default socket;