class Draw extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            index:props.data.index,

        }
        this.saveDraw = this.saveDraw.bind(this);
        this.setIndex = this.setIndex.bind(this);
    }

    setIndex(e){
        this.setState({
            index:e
        })
    }

    saveDraw(d){
        let content = this.refs.content.innerHTML;
        if (d != null) {
            d.content = content;
        } else {
            let row = this.props.data.currentRow;
            let draws = this.props.data.steps[row];
            if (draws == null) {
                draws = [];
            }
            draws.push({
                step: this.state.index,
                content: content,
                row: row
            })
            this.props.data.steps[row] = draws;
            this.props.addDraw(this.props.data.steps, content);
            this.setState({
                index:this.state.index+1
            })
        }

    }

    componentDidMount(){
        svgE();
    }

    componentDidUpdate(){
        svgE();
    }

    render(){

        let row = this.props.data.currentRow;
        let draws = this.props.data.steps[row];
        if (draws == null) {
            draws = [];
        }

        let tags = [];
        let style = {
            backgroundColor:"#61b961",
            color:"#FFF"
        };
        let content;
        let draw = null;
        for (let i = 0; i < draws.length; i++) {
            let step = draws[i].step;
            if (step == this.state.index){
                tags.push(<button disabled={true} onClick={()=>this.setIndex(step)} style={style}>步骤{step}</button>)
                content=draws[i].content;
                draw = draws[i];
            } else {
                tags.push(<button onClick={()=>this.setIndex(step)}>步骤{step}</button>)
            }
        }
        let step = this.props.data.index;
        if (step == this.state.index) {
            tags.push(<button disabled={true} onClick={() => this.setIndex(step)} style={style}>步骤{step}</button>)
            let last = this.props.data.last;
            if (last == null) {
                content='<svg id="svg" width="100%" height="600px" > </svg>';
            } else {
                content=last;
            }
        } else {
            tags.push(<button onClick={()=>this.setIndex(step)}>步骤{step}</button>)
        }
        return (

            <div className="draw">
                <div className="tags">
                    {tags}
                    <button onClick={()=>this.saveDraw(draw)}>保存</button>
                </div>
                <div className="contents" >
                    <div className="editor-box clearfix" >
                        <div className="action-show" ref="content" dangerouslySetInnerHTML={{__html:content}}>
                        </div>
                        <div className="action-box">
                            <h2>创建</h2>
                            <div className="create">
                                <select className="selectChange" >
                                    <option value="func">函数栈</option>
                                    <option value="array">数组</option>
                                    <option value="pointer">指针</option>
                                    <option value="var">变量</option>
                                </select>
                                <button id="func" sname="" className="changeName" type="button">创建</button>

                            </div>
                            <h2>形状</h2>
                            <div className="create-shape" id="xz"></div>

                        </div>

                    </div>

                </div>
            </div>
        )
    }
}

