import React from 'react';
import Cookie from 'universal-cookie';

const cookies = new Cookie();

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);
    }

    clearCookies() {
        let c = cookies.getAll();
        Object.keys(c).forEach(key => {
            cookies.remove(key);
        });
        window.location.reload(false);
    }

    render() {
        return (<div>
            <button onClick={this.clearCookies} className="bg-gray-700 text-white rounded px-4 py-2">Clear cookies</button>
        </div>)
    }
}