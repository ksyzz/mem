const {
    HashRouter,
    Switch,
    Route,
    Link
} = ReactRouterDOM;
class Body extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId : sessionStorage.getItem("userId")

        };
        this.refresh = this.refresh.bind(this);
    }

    refresh(){
        this.setState({
            userId : sessionStorage.getItem("userId"),
        })
    }

    render(){
        let userId = this.state.userId;
        console.log(userId);
        return (
            <div>

                {userId == null ? <Login refresh={this.refresh}/> : <Main />}
            </div>
        )
    }
}
class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error : false
        }
        this.refresh = this.refresh.bind(this);
        this.toLogin = this.toLogin.bind(this);
    }

    refresh(){
        this.props.refresh();
    }

    toLogin() {

        const userId = this.refs.userId.value;
        const password = this.refs.password.value;
        const url = '/login?userId='+userId+'&password='+password;
        let that = this;

        fetch(url, {
            method:'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(
                (result) => {
                    if (result.state != 200) {
                        result = {
                            userName: '教师',
                            userId: '123456',
                            type: 'TEACHER'
                        }
                        sessionStorage.setItem("userName", result.userName);
                        sessionStorage.setItem("userId", result.id);
                        sessionStorage.setItem("type", result.type);
                        that.setState({
                            error:false,
                        });
                        that.props.refresh();
                    } else {
                        that.setState({
                            error:true,
                        });
                    }

                },

            )
            .catch(function () {
                that.setState({
                    error:true
                })
            })
    }
    render(){
        let error = this.state.error;
        let estyle = {
            color : 'red'
        }
        return (
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                        <h4 className="modal-title" id="myModalLabel">
                            登录
                        </h4>
                    </div>
                    <div className="modal-body">
                        <div className="sfModal-content">
                            <div className="row bg-white login-modal">
                                <div className="col-md-12 login-wrap">
                                    <div className="mt15">
                                        <div className="form-group hidden">
                                            <input type="text" className="form-control" name="remember" value="1" autocomplete="off"/>
                                        </div>
                                        <div className="form-group">
                                            <label className="control-label">帐号</label>
                                            <input type="text" className="form-control" ref="userId"  name="username" tabindex="1" required="" placeholder="帐号" autocomplete="off"/>
                                        </div>
                                        <div className="form-group">
                                            <label className="control-label">密码</label><span className="pull-right"><a href="#" tabindex="4">忘记密码</a></span>
                                            <input type="password" className="form-control" ref="password" name="password" tabindex="2" required="" placeholder="请输入密码"/>
                                        </div>
                                        {error && <p style={estyle}>用户名或密码错误</p>}
                                        <br/>
                                        <div className="form-group clearfix">
                                            <button onClick={this.toLogin} className="btn-block btn btn-primary pull-right pl20 pr20" tabindex="3" >登录
                                            </button>
                                        </div>
                                        <div className="form-group clearfix">
                                            <a disabled={true} className="btn-block btn btn-default pull-right pl20 pr20 SFLogin" >
                                                注册新账号
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

class Main extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        return (
            <div>
                <Navigation />
                <Switch>
                    <Route exact path="/" component={Center}/>
                    <Route exact path="/project/view/:id" component={ProjectInfo}/>
                    <Route exact path="/project/create" component={Create}/>
                </Switch>
            </div>
        )
    }
}

class Navigation extends React.Component {
    render(){
        return (
            <div className="weplay-header">
                <div className="userInfo">
                    {sessionStorage.getItem("userName")}，您好

                </div>
            </div>
        )
    }
}

class Center extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            projects : []
        }
        this.getData = this.getData.bind(this);
    }

    getData(){
        let url = '';
        let that = this;
        fetch(url, {
            method:'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(
                (result) => {
                    if (result.state == 200) {

                        that.setState({
                            projects:result,
                        });
                    }
                },

            )
            .catch(function () {
                that.setState({
                    error:true
                })
            })
    }

    render(){
        let projects = [];
        for (let i = 0 ; i < 5; i++) {
            projects.push({
                id:""+i+"",
                name:"项目"+i,
                creator: "教师",
                created: '2018/04/23'
            })
        }
        let dom = [];
        dom.push(
            <tbody>
                {projects.map((item) =>
                    <tr>
                        <td>{item.id}</td>
                        <td><Link to={`/project/view/${item.id}`}>{item.name}</Link></td>
                        <td>{item.creator}</td>
                        <td>{item.created}</td>
                    </tr>
                )}
            </tbody>
        )
        let type = sessionStorage.getItem("type");
        return (
            <div className="plist">
                {type == 'TEACHER' && <div className="createProject"><Link to='/project/create'>创建项目</Link></div>}
                    <table className="table table-striped" contenteditable="true">
                        <thead>
                        <tr>
                            <th>序号</th>
                            <th>名称</th>
                            <th>创建人</th>
                            <th>创建时间</th>
                        </tr>

                        </thead>
                        {dom}

                    </table>

            </div>
        )
    }
}

class ProjectInfo extends React.Component {
    render(){
        return (
            <div>查看项目<div className="createProject"><Link to='/'>返回</Link></div></div>
        )
    }
}

class Create extends React.Component {
    render(){
        return (
            <div>创建项目<div className="createProject"><Link to='/'>返回</Link></div></div>
        )
    }
}
ReactDOM.render(<HashRouter><Body/></HashRouter>,  document.getElementById("container"));
