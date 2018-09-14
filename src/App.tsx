import * as React from 'react';
import './App.css';

import {FieldWrapper, FormWrapper} from './components';
import logo from './logo.svg';

class App extends React.Component {

  public onSubmit = (e: any) => {
    console.log(e);
  }

  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
        <FormWrapper id="new-form" submitLabel="Submit" handleFormSubmit={this.onSubmit}>
          <FieldWrapper id="textInput" label="label">
            <input id="textInput" type="text" className="form-control"/>
          </FieldWrapper>
        </FormWrapper>
      </div>
    );
  }
}

export default App;
