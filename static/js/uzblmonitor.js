$.fn.editable.defaults.mode = 'inline';

var MonitorRow = React.createClass({
  componentDidMount: function() {
    $(this.refs.editableAlias.getDOMNode()).editable()
    $(this.refs.editableURL.getDOMNode()).editable()
    $(this.refs.editableRate.getDOMNode()).editable()
  },

  doDelete: function() {
    $.post("/monitor/delete", {host: this.props.monitorConfig.host}, function(result) {
      this.props.table.deleteMonitor(this.props.monitorConfig.host);
    }.bind(this));
  },

  doRefresh: function() {
    $.post("/monitor/refresh", {host: this.props.monitorConfig.host});
  },

  render: function() {
    var host = this.props.monitorConfig.host,
        alias = this.props.monitorConfig.alias,
        url = this.props.monitorConfig.url,
        refresh_rate = this.props.monitorConfig.refresh_rate;

    var hostColValue;

    if (alias) {
        hostColValue = this.props.monitorConfig.alias;
    } else {
        hostColValue = (<em>{this.props.monitorConfig.host}</em>);
    }

    var hostCol = (
        <a href="#"
           ref="editableAlias"
           name="alias"
           title={host}
           data-type="text"
           data-pk={host}
           data-url="/monitor/update_alias"
           data-title="Monitor alias"
           data-value={alias || ""}
           data-emptytext={host}
           data-emptyclass="no-alias"
           data-unsavedclass="">
            {hostColValue}
        </a>
    );

    var urlCol = (
        <a href="#"
           ref="editableURL"
           name="url"
           data-type="text"
           data-pk={host}
           data-url="/monitor/update_url"
           data-title="Monitor URL"
           data-unsavedclass="">
            {url}
        </a>
    );

    var refreshCol = (
        <a href="#"
           ref="editableRate"
           name="refresh_rate"
           data-type="text"
           data-pk={host}
           data-url="/monitor/update_refresh_rate"
           data-title="Refresh Rate (sec)"
           data-value={refresh_rate || ""}
           data-emptytext="None"
           data-emptyclass="no-alias"
           data-unsavedclass="">
            {refresh_rate}
        </a>
    );

    return (
      <tr>
        <td><span className="glyphicon glyphicon-remove delete-icon" onClick={this.doDelete}></span></td>
        <td>{hostCol}</td>
        <td>{urlCol}</td>
        <td className="cell-refresh"><span className="glyphicon glyphicon-refresh refresh-icon" onClick={this.doRefresh}></span></td>
        <td className="cell-rate">{refreshCol}</td>
      </tr>
    );

  }
});

var MonitorTable = React.createClass({
  getInitialState: function() {
    return {
      monitorConfigs: window.monitorConfigs
    };
  },

  deleteMonitor: function(host) {
    var monitorConfigs = this.state.monitorConfigs.slice(0);

    for (var i in monitorConfigs) {
      if (monitorConfigs[i].host === host) {
        monitorConfigs.splice(i, 1);
        break;
      }
    }

    this.setState({
      monitorConfigs: monitorConfigs
    });
  },

  render: function() {
    var rows = [];
    this.state.monitorConfigs.forEach(function(monitorConfig) {
      rows.push(<MonitorRow key={monitorConfig.host} table={this} monitorConfig={monitorConfig} />);
    }.bind(this));

    return (
      <table className="table table-bordered">
        <thead>
          <tr>
            <th width="0"></th>
            <th width="50%">Host</th>
            <th width="50%">URL</th>
            <th width="0">Refresh</th>
            <th width="0">Rate</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
});

React.render(
  <MonitorTable />,
  document.getElementById('monitortable')
);
