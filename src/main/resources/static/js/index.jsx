const {
    HashRouter,
    Switch,
    Route,
    Link
} = ReactRouterDOM;
const Draw = Draw;
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
        // this.getData = this.getData.bind(this);
    }

    // getData(){
    //     let url = '/projects';
    //     let that = this;
    //     fetch(url, {
    //         method:'GET',
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json'
    //         }
    //     })
    //         .then(res => res.json())
    //         .then(
    //             (result) => {
    //                 if (result.state == 200) {
    //
    //                     that.setState({
    //                         projects:result,
    //                     });
    //                 }
    //             },
    //
    //         )
    //         .catch(function () {
    //             that.setState({
    //                 error:true
    //             })
    //         })
    // }

    render(){
        let projects = [];
        $.ajax({
            url:'/projects',
            type:'get',
            contentType:'application/json',
            dataType:'json',
            async:false,
            success:function (data) {
                projects = data;
            }
        })

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
        let id = this.props.match.params.id;
        let project;
        $.ajax({
            url:'/project/'+id,
            type:'get',
            contentType:'application/json',
            dataType:'json',
            async:false,
            success:function (data) {
                projects = data;
            }
        })
        let codes = project.codes;
        let steps = project.steps;
        // codes.push('int function(int n)');
        // codes.push('{');
        // codes.push('    if (n == 1)');
        // codes.push('        return 1;');
        // codes.push('    else');
        // codes.push('        return 0;');
        // codes.push('}');
        // let steps = [];
        // steps.push({
        //     index:1,
        //     row:1,
        //     content:'步骤1'
        // });
        // steps.push({
        //     index:2,
        //     row:3,
        //     content:'步骤2'
        // });
        // steps.push({
        //     index:3,
        //     row:5,
        //     content:'步骤3'
        // });
        // steps.push({
        //     index:4,
        //     row:6,
        //     content:'步骤4'
        // });

        return (
            <div className="cmain">
                <div className="return"><h3>{project.name}</h3><Link to='/'>返回</Link></div>
                <Show codes={codes} steps={steps}/>
            </div>
        )
    }
}

class Show extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            index : 1
        }
        this.prev = this.prev.bind(this);
        this.next = this.next.bind(this);
    }
    prev(){
        this.setState({
            index:this.state.index-1
        })
    }
    next(){
        this.setState({
            index:this.state.index+1
        })
    }

    render(){
        let codes = this.props.codes;
        let index = this.state.index;
        let steps = this.props.steps;
        let style = {
            backgroundColor:"#ffffc3"
        }
        let left = [];
        for (let i = 1; i <= codes.length; i++) {
            left.push(
                <tr>
                    <td className="index">{i}</td>
                    {steps[index-1].row == i ? <td className="code" style={style}>
                        {codes[i - 1]}
                     </td> : <td className="code">
                        {codes[i - 1]}
                    </td>
                    }
                </tr>
            )
        }
        return(
            <div>
                <div className="createProject">
                    <table className="ctable" contenteditable="true">
                        <tbody>
                        {left}
                        </tbody>
                    </table>
                </div>
                <div className="draw">
                    <div className="contents" >
                        <div className="editor-box clearfix" >
                            <div className="action-show" ref="content" dangerouslySetInnerHTML={{__html:this.props.steps[index-1].content}}>
                            </div>
                        </div>
                    </div>
                </div>
                <div >
                    <div className="bl"><button  onClick={this.prev} disabled={index == 1}>上一步</button>
                        <button  onClick={this.next} disabled={index == steps.length}>下一步</button></div>
                </div>
            </div>
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
            index:1,
            last: null
        }
        this.addOneRow = this.addOneRow.bind(this);
        this.focusRow = this.focusRow.bind(this);
        this.addDraw = this.addDraw.bind(this);
        this.saveProject = this.saveProject.bind(this);
        // this.addOneIndex = this.addOneIndex.bind(this);
    }

    addOneRow(){
        this.setState({
            rows : this.state.rows + 1
        })
    }

    focusRow(e){
        this.setState({
            currentRow : e
        })
    }

    addDraw(e, last){
        this.setState({
            steps : e,
            index : this.state.index + 1,
            last:last
        })
    }

    saveProject(){
        let steps = this.state.steps;
        let rows = this.refs;
        let codes = [];
        for (var row in rows){
            codes.push({
                row:row,
                code: rows[row].value
            });
        }
        let project = prompt("请输入项目名称");
        let info = {
            name : project,
            codes : codes,
            steps : steps
        }
        let that = this;
        $.ajax({
            url:'/project',
            type:'post',
            contentType:'application/json',
            dataType:'json',
            data:info,
            success:function () {
                that.props.history.push('/');
            }
        })

    }

    render(){
        let style = {
            backgroundColor:'#f9ffa9'
        }
        let normal = {
            backgroundColor:'#FFF'
        }
        let codes = [];
        let rows = this.state.rows;
        for (let i = 1; i <= rows; i++) {
            codes.push(
                <tr>
                    <td className="index">{i}</td>
                    <td className="code">
                        <input type='text' ref={`${i}`} onClick={()=>this.focusRow(i)} style={i==this.state.currentRow ? style : normal} className='line'/>
                    </td>
                </tr>
            )
        }
        return (
            <div className="cmain">
                <div className="return"><Link className='ra' to='/'>返回</Link><a role='button' className='ra1' onClick={this.saveProject}>保存项目</a></div>
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

ReactDOM.render(<HashRouter><Body/></HashRouter>,  document.getElementById("container"));



