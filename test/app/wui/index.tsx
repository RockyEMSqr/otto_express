import { h, Component } from 'preact';
export const IndexPage = (p?) => {
    return <div>
        <h1>Hello From Preact</h1>
        <pre>{JSON.stringify(p, null, '\t')}</pre>
    </div>
}
export class IndexPageComp extends Component {
    render(p, s) {
        return <div>
            <h1>Hello From Preact Comp</h1>
            <pre>{JSON.stringify(p, null, '\t')}</pre>
        </div>
    }
}