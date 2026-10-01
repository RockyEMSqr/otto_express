import { html, render, useState, Component } from './htm.js';
export const App = (p) => {
    let [state, setState] = useState({ x: p.x });
    return html`<div>
    <h1>Hello Htm ${state.x}</h1>
    <button onClick=${x => {
            setState({ x: state.x + 1 });
            }}>++</button>
    <button onClick=${x => {
            setState({ x: state.x - 1 });
            }}>--</button>
    <pre>${JSON.stringify(state, null, '\t')}</pre>
</div>`
};
export class AppComp extends Component{
    componentWillMount(){
        console.log(this.props.x || x);
        this.setState({x:this.props.x || x});
    }
    render(){
        return html`<div>
    <h1>Hello Htm ${this.state.x}</h1>
    <button onClick=${x => {
            this.setState({ x: this.state.x + 1 });
            }}>++</button>
    <button onClick=${x => {
            this.setState({ x: this.state.x - 1 });
            }}>--</button>
    <pre>${JSON.stringify(this.state, null, '\t')}</pre>
</div>`
    }
}