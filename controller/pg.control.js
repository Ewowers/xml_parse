const pool = require("../model/pg");
class Control {
  async request(props) {
    const { token, sendMessage } = props;
    const { request } = sendMessage;
    const { messageInfo } = request;
    const pg = await pool.query(
      `INSERT INTO Request (token, messageId, correlationId, serviceId, messageType, messageDate, senderId, password) values($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        token,
        messageInfo.messageId,
        messageInfo.correlationId,
        messageInfo.serviceId,
        messageInfo.messageType,
        messageInfo.messageDate,
        messageInfo.sender.senderId,
        messageInfo.sender.password,
      ]
    );
  }
  async notif(props) {
    const { token, sendMessage } = props;
    const { request } = sendMessage;
    const { messageInfo } = request;
    const pg = await pool.query(
      `INSERT INTO Notif (token, messageId, correlationId, serviceId, messageType, messageDate, senderId, password) values($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        token,
        messageInfo.messageId,
        messageInfo.correlationId,
        messageInfo.serviceId,
        messageInfo.messageType,
        messageInfo.messageDate,
        messageInfo.sender.senderId,
        messageInfo.sender.password,
      ]
    );
  }
  async first(props) {
    const { token, sendMessage } = props;
    const { request } = sendMessage;
    const { messageInfo } = request;
    const pg = await pool.query(
      `INSERT INTO first_resp (token, messageId, correlationId, serviceId, messageType, messageDate, senderId, password) values($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        token,
        messageInfo.messageId,
        messageInfo.correlationId,
        messageInfo.serviceId,
        messageInfo.messageType,
        messageInfo.messageDate,
        messageInfo.sender.senderId,
        messageInfo.sender.password,
      ]
    );
  }
}
module.exports = new Control();
