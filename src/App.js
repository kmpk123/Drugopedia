import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ReactTable from "react-table";
import "react-table/react-table.css";


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      drugName: "",
      loading: false,
      data: {}
    }

    this.baseUrl = "https://api.fda.gov/drug/label.json?search=";
    this.columns = [{
      Header: "Effectivetime",
      accessor: "effective_time"
    },{
      id: 'adversereactions', // Required because our accessor is not a string
      Header: 'Reactions',
      accessor: d => {if(d.adverse_reactions) {return d.adverse_reactions[0]} else {
        return ""
      }} // Custom value accessors!
    }]

    this.onDrugNameChange = this.onDrugNameChange.bind(this);
    this.getDrugData = this.getDrugData.bind(this);
    this.afterFetchingResults = this.afterFetchingResults.bind(this);
  }

  onDrugNameChange(event) {
    this.setState({
      drugName: event.target.value
    })
  }

  getDrugData () {
    let { drugName } = this.state;
    let url = this.baseUrl + drugName + "&limit=100";
    fetch(url)
    .then(function(response) {
      return response.json();
    })
    .then((myJson)=> {
      // console.log(JSON.stringify(myJson));
      this.afterFetchingResults(myJson);
    });

    this.setState({
      loading: true
    })
  }

  afterFetchingResults (data) {
    console.log(data)
    this.setState({
      loading: false,
      drugData: data.results
    })
  }

  render() {
    let { loading, data} = this.state;

    
    return (
      <div className="App">
        <div className="nav-bar">
          Know-Drug
        </div>
        <div className="container"> 
          <input value={this.state.drugName} onChange={this.onDrugNameChange} />
          <button onClick={this.getDrugData}>search</button>

          <div className="drug-data-loading"> {}
            {
              (loading) ? 
              <div className="loading-wrapper">
                <img src={logo} className="loading" alt="logo" />
              </div> : 
              <div className="drug-data-table-wrapper">
              <ReactTable 
                data={this.state.drugData}
                columns={this.columns}
                defaultPageSize={10}                
              />
              </div>
              
            }
          </div>
        </div>
      </div>
    );
  }
}

export default App;
