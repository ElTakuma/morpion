import { LineChart, Line } from "Recharts.js";

class InputNumber extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.props.onInputNumberChange(e.target.value);
    }

    render() {
        const value = this.props.inputValue;
        const placeholder = this.props.placeholder;

        return (
            <input type="number" className="input-form" value={value} min='0' placeholder={placeholder}  onChange={this.handleChange} />
        )
    }
}

function imcCalcul(size, weight) {
    const size_m = size / 100;
    let size_sqrt = parseFloat(size_m * size_m);

    if(size < 100) {
        size_sqrt = parseFloat((size_m * size_m) * 100);
    }
    return parseFloat(Math.round(parseFloat(weight/size_sqrt) * 1000) / 1000);
}


class Formular extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            size: '',
            weight: '',
            validable: false,
            history: [{
                code: null,
                size: null,
                weight: null,
                date: null,
                imc: null
            }]
        };
        this.handleSizeChange = this.handleSizeChange.bind(this);
        this.handleWeightChange = this.handleWeightChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSizeChange(size) {
        if (size > 0) {
            this.setState({ size: size });

            this.state.weight > 0 ? this.setState({ validable: true }) : this.setState({ validable: false });
        } else {
            this.setState({ size: 0, validable: false });
        }
        
    }

    /**
     * Detect tous les changements de l'input type text weight
     * @param {*} weight 
     */
    handleWeightChange(weight) {
        if(weight > 0) {
            this.setState({ weight: weight });

            this.state.size > 0 ? this.setState({ validable: true }) : this.setState({ validable: false });
        } else {
            this.setState({ weight: 0, validable: false });
        }
    }

    handleSubmit(event) {
        
        this.setState({
            history: this.state.history.concat([{
                code: new Date().toLocaleDateString() +  new Date().toLocaleTimeString(),
                size: this.state.size,
                weight: this.state.weight,
                date: new Date().toLocaleDateString(),
                imc: imcCalcul(this.state.size, this.state.weight)
            }]),
        });
        
    }

    render() {
        let buttonDisable;
        this.state.validable ? buttonDisable = false : buttonDisable = true;

        const renderLineChart = (
            <LineChart width={600} height={300} data={this.state.history} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <Line type="monotone" dataKey="code" stroke="#8884d8" />
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
            </LineChart>
        );

        const history = this.state.history.map((h, index) => {
            // console.log(h)
            return (
                <div key={h.code} className="history_grid-items">
                    <div>
                        <b >Taille: </b>
                        {h.size}
                    </div>
                    <div>
                        <b>Poids: </b>
                        {h.weight}
                    </div>
                    <div>
                        <b>IMC: </b>
                        {h.imc}
                    </div>
                </div>
            )
        });

        return (
            <div>
                <div>
                   <h1 className="white head-title"><span className="lowcase">Calculateur</span> IMC</h1>
                </div>
                <div className="form-grid">
                <div>
                        <InputNumber inputValue={this.props.weight} placeholder="Poids en Kg" onInputNumberChange={this.handleWeightChange} />
                    </div>
                    <div>
                        <InputNumber inputValue={this.props.size} placeholder="Taille en Cm" onInputNumberChange={this.handleSizeChange}/>
                    </div>
                </div>
                <div className="submit-align">
                    <button type="submit" className="submit-btn" disabled={buttonDisable} onClick={this.handleSubmit}>Calculer</button>
                </div>
                {/* <span className="white">{this.state.size}</span> */}
                <div className="graphe-container">
                    {renderLineChart}
                </div>
                <div className="history_grid">
                    {history}
                </div>
            </div>
        )
    }
}

ReactDOM.render(
    <Formular />, document.getElementById("root")
)