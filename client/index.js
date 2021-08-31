const Auth = ({ setState }) => {
  //форма авторизаций по логину и поролю
  const [form, setForm] = React.useState();
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleClick = () => {
    axios.post("/api/user/auth", form).then((res) => (res.data ? setState(true) : null));
  };
  return (
    <div>
      <div className="mb-3">
        <span>Логин</span>
        <input type="text" name="username" className="form-control" onChange={handleChange} />
      </div>
      <div className="mb-3">
        <span>Пороль</span>
        <input type="password" name="password" className="form-control" onChange={handleChange} />
      </div>
      <button className="btn btn-primary" onClick={handleClick}>
        Войти
      </button>
    </div>
  );
};
const AuthToken = ({ setState }) => {
  //форма авторизаций по ключу
  const token = (file) => {
    axios.post("/api/user/authToken", { token: file }).then((res) => setState(res.data));
  };
  const handleChange = (e) => {
    let reader = new FileReader();
    let file;
    reader.readAsText(e.target.files[0]);
    reader.onload = (msg) => token(msg.target.result);
  };
  return <input type="file" className="form-control" name="token" onChange={handleChange} />;
};
const Foo = () => {
  //внешний вид
  const [state, setState] = React.useState(false);
  React.useEffect(() => {
    //проверка токена при входе
    axios.post("/api/user/onload").then((res) => setState(res.data));
  }, []);
  const clear = () => {
    //выход
    axios.post("/api/user/out").then((res) => {
      if (res.data) setState(false);
    });
  };
  if (state) {
    return (
      <div className="centerPos">
        <h1>Вы авторизованы</h1>
        <button className="btn btn-danger m-auto d-block" onClick={clear}>
          Выход
        </button>
      </div>
    );
  } else {
    return (
      <div className="container-fluid">
        <div className="row justify-content-center align-items-center" style={{ height: "100vh" }}>
          <div className="col-md-4">
            <ul className="nav nav-tabs" id="myTab" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link active"
                  id="home-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#home"
                  type="button"
                  role="tab"
                >
                  Войти
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  id="profile-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#ecp"
                  type="button"
                  role="tab"
                >
                  Войти
                </button>
              </li>
            </ul>
            <div className="tab-content" id="myTabContent">
              <div className="tab-pane fade show active" id="home" role="tabpanel">
                <Auth setState={setState} />
              </div>
              <div className="tab-pane fade" id="ecp" role="tabpanel" aria-labelledby="profile-tab">
                <AuthToken setState={setState} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
ReactDOM.render(<Foo />, document.getElementById("root"));
