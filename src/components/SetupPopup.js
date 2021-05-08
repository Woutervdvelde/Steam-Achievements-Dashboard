import React, {useState} from "react";

export default class SetupPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user_id: '',
            api_key: '',
            button_loading: false,
            errors: {
                user_id: '',
                api_key: ''
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleSubmit(event) {
        this.setState({
            button_loading: true,
            errors: {
                user_id: '',
                api_key: ''
            }
        })
        let err = false;

        if (this.state.user_id === '') {
            err = true;
            this.state.errors.user_id = "No user ID provided";
        }

        if (this.state.api_key === '') {
            err = true;
            this.state.errors.api_key = "No API key provided";
        }


        if (err)
            return this.setState({button_loading: false});

        event.preventDefault();
    }

    render() {
        return (
            <>
                <div
                    className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50"
                >
                    <div className="relative w-auto my-6 mx-auto max-w-3xl">
                        {/*content*/}
                        <div
                            className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white">
                            {/*header*/}
                            <div
                                className="flex items-start justify-between p-5 border-b">
                                <h3 className="text-3xl font-semibold">
                                    Your info
                                </h3>
                            </div>
                            {/*body*/}
                            <div className="relative p-6 flex-auto">
                                <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                                    To be able to see your stats you need to fill in your user id and also an API key.
                                    You can see how you obtain an API key <a
                                    href="https://steamcommunity.com/dev/apikey" className="underline">here</a>
                                </p>
                                <form>
                                    <label htmlFor="user_id">User id:</label>
                                    <input name="user_id" type="text" placeholder="76561198201679638"
                                           onChange={this.handleChange} className="mx-2 border-dashed"/>
                                    <span className='error'>{this.state.errors.user_id}</span>
                                    <br/>
                                    <label htmlFor="api_key"> Api key:</label>
                                    <input name="api_key" type="text" placeholder="AAAAABBBBBBCCCCCDDDDD11111222233"
                                           onChange={this.handleChange} className="mx-2"/>
                                    <span className='error'>{this.state.errors.api_key}</span>
                                </form>
                            </div>
                            {/*footer*/}
                            <div
                                className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                                <button type="button" onClick={this.handleSubmit}
                                        className="py-2 px-4 w-full sm:w-1/6 rounded-md bg-black text-white font-bold shadow hover:shadow-lg ">
                                    {this.state.button_loading ?
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                    strokeWidth="4"/>
                                            <path className="opacity-75" fill="currentColor"
                                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                        </svg> : "Save"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
            </>);
    }
}
