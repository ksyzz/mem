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
            userId : sessionStorage.getItem("userId"),
            userName : sessionStorage.getItem("userName")
        };
        this.refresh = this.refresh.bind(this);
    }

    refresh(){
        this.setState({
            userId : sessionStorage.getItem("userId"),
            userName : sessionStorage.getItem("userName")
        })
    }

    render(){
        let userId = this.state.userId;
        console.log(userId);
        return (
            <div>

                {userId == null && <Login refresh={this.refresh}/>}
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
        that.setState({
            error:false,
        });
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
                    result = {
                        userName : '教师',
                        userId : '123456',
                        type : 'teacher'
                    }
                    sessionStorage.setItem("userName", result.userName);
                    sessionStorage.setItem("userId", result.id);
                    sessionStorage.setItem("type", result.type);

                    that.props.refresh();
                    $(".modal-backdrop").hide();

                },
                (error) => {
                    window.alert("用户名或密码错误！");
                    that.setState({
                        error:true
                    })
                }
            )
            .catch(function () {
                that.setState({
                    error:true
                })
            })
    }
    render(){
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
                                            <input type="number" className="form-control" ref="userId"  name="username" tabindex="1" required="" placeholder="帐号" autocomplete="off"/>
                                        </div>
                                        <div className="form-group">
                                            <label className="control-label">密码</label><span className="pull-right"><a href="#" tabindex="4">忘记密码</a></span>
                                            <input type="password" className="form-control" ref="password" name="password" tabindex="2" required="" placeholder="请输入密码"/>
                                        </div>
                                        {this.state.error && <p style="color:#F00">用户名或密码错误</p>}
                                        <br/>
                                        <div className="form-group clearfix">
                                            <button onClick={this.toLogin} className="btn-block btn btn-primary pull-right pl20 pr20" tabindex="3" >登录
                                            </button>
                                        </div>
                                        {/*<div className="form-group clearfix">*/}
                                            {/*<a className="btn-block btn btn-default pull-right pl20 pr20 SFLogin" >*/}
                                                {/*注册新账号*/}
                                            {/*</a>*/}
                                        {/*</div>*/}
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

ReactDOM.render(<HashRouter><Body/></HashRouter>,  document.getElementById("container"));
