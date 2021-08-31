const Row = (props) => {
  const { event, user, ip, method, date } = props.info;
  return (
    <>
      <tr>
        <th className="col-4">{event}</th>
        <th className="col-1">{user}</th>
        <th className="col-1">{ip}</th>
        <th className="col-1">{method}</th>
        <th className="col-1">{date}</th>
      </tr>
    </>
  );
};
const Container = () => {
  const [rows, setRows] = React.useState([]);
  fetch("/api/debug")
    .then((res) => res.json())
    .then((res) => setRows(res.reverse()));
  console.log(rows);
  const list = rows.map((item, i) => <Row info={item} key={i} />);
  return (
    <>
      <table class="table table-striped">
        <thead>
          <tr>
            <th scope="col-4">Событие</th>
            <th scope="col-1">Пользователь</th>
            <th scope="col-1">ip</th>
            <th scope="col-1">Метод</th>
            <th scope="col-1">Дата</th>
          </tr>
        </thead>
        <tbody>{list}</tbody>
      </table>
    </>
  );
};
ReactDOM.render(<Container />, document.getElementById("root"));
