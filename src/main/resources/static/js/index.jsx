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
                    {/*<a id="modal-21646" role="button" className="btn-register"*/}
                        {/*data-toggle="modal" onClick={this.quit}>退出</a>*/}
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
                {type == 'TEACHER' && <div className="return"><Link to='/project/create'>创建项目</Link></div>}
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
            <div>查看项目<div className="return"><Link to='/'>返回</Link></div></div>
        )
    }
}

class Create extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: 15,
            steps:{},
            currentRow: 1,
            index:1
        }
        this.addOneRow = this.addOneRow.bind(this);
        this.focusRow = this.focusRow.bind(this);
        this.addDraw = this.addDraw.bind(this);
        // this.addOneIndex = this.addOneIndex.bind(this);
    }

    addOneRow(){
        this.setState({
            rows : this.state.rows + 1
        })
    }

    // addOneIndex(){
    //     this.setState({
    //         index : this.state.index + 1
    //     })
    // }

    focusRow(e){
        this.setState({
            currentRow : e
        })
    }

    addDraw(e){
        this.setState({
            steps : e,
            index : this.state.index + 1
        })
    }

    render(){
        let codes = [];
        let rows = this.state.rows;
        for (let i = 1; i <= rows; i++) {
            codes.push(
                <tr>
                    <td className="index">{i}</td>
                    <td className="code">
                        <input type='text' onclick={()=>this.focusRow(i)} className='line'/>
                    </td>
                </tr>
            )
        }
        return (
            <div className="cmain">
                <div className="return"><Link to='/'>返回</Link></div>
                <div className="createProject">
                    <table className="ctable" contenteditable="true">
                        <tbody>
                            {codes}
                        </tbody>
                    </table>
                    <div className='addrow'><a onClick={this.addOneRow}>添加一行</a></div>
                </div>
                <Draw data={this.state} addDraw={this.addDraw} />
            </div>
        )
    }
}

class Draw extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            draw:{
                step:props.data.index,
                content:'添加流程图'
            }
        }
        this.saveDraw = this.saveDraw.bind(this);
        this.setDraw = this.setDraw.bind(this);
    }

    setDraw(e){
        this.setState({
            draw:e
        })
    }

    saveDraw(){
        let content = this.refs.content.innerHTML;
        let row = this.props.data.currentRow;
        let draws = this.props.data.steps[row];
        if (draws == null) {
            draws = [];
        }
        draws.push({
            step:this.props.data.index,
            content: content
        })
        this.props.data.steps[row] = draws;
        this.props.addDraw(this.props.data.steps)
    }

    render(){
        let row = this.props.data.currentRow;
        let draws = this.props.data.steps[row];
        if (draws == null) {
            draws = [];
        }
        draws.push({
            step:this.props.data.index,
            content: '添加流程图'
        })
        let tags = [];
        let style = {
            backgroundColor:"#61b961",
            color:"#FFF"
        };
        for (let i = 0; i < draws.length; i++) {
            let step = draws[i].step;
            if (step == this.props.data.index){
                tags.push(<button disabled={true} onClick={()=>this.setDraw(draws[i])} style={style}>步骤{step}</button>)
            } else {
                tags.push(<button onClick={()=>this.setDraw(draws[i])}>步骤{step}</button>)
            }

        }

        return (
            <div className="draw">
                <div className="tags">
                        {tags}
                        <button onClick={this.saveDraw}>保存</button>
                </div>
                <div className="contents" ref="content">
                  {this.state.draw.content}
                </div>
            </div>
        )
    }
}
ReactDOM.render(<HashRouter><Body/></HashRouter>,  document.getElementById("container"));



