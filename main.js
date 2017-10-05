var React;
var ReactDom;
var items;

var ListItem = React.createClass({
    propTypes: {
        id: React.PropTypes.number,
        name: React.PropTypes.string,
        email: React.PropTypes.string,
        onDeleteButtonClicked: React.PropTypes.func
    },
    render: function () {
        return (
            React.createElement('li', {},
                React.createElement('a', {
                    href: '#item/' + this.props.id
                },
                React.createElement('div', {}, this.props.name),
                React.createElement('div', {}, this.props.email)),
                React.createElement('button', {
                    id: 'item-' + this.props.id,
                    onClick: this.props.onDeleteButtonClicked
                }, 'X')
            )

        );
    }
});

let NavMenu = React.createClass({
    render: function () {
        return (
            React.createElement('ul', {
                className: 'nav-menu'
            },
            React.createElement('li', {},
                React.createElement('a', {
                    href: '#list'
                }, 'List')
            ),
            React.createElement('li', {},
                React.createElement('a', {
                    href: '#new'
                }, 'New')
            )
            )
        );
    }
});

var Item = React.createClass({
    render: function () {
        return (
            React.createElement('div', {})
        );
    }
});

var List = React.createClass({
    propTypes: {
        items: React.PropTypes.array
    },
    render: function () {
        var self = this;
        var listItems = this.props.items.map(function (item) {
            item.onDeleteButtonClicked = self.props.onItemDeleted;
            return React.createElement(ListItem, item);
        });

        return (
            React.createElement('div', {},
                React.createElement(NavMenu, {}),
                React.createElement('ul', {},
                    listItems
                )
            )
        );
    }
});

let New = React.createClass({
    propTypes: {
        menuItem: React.PropTypes.object.isRequired,
        onNewMenuItemChange: React.PropTypes.func,
        onSubmit: React.PropTypes.func
    },
    onNameChange: function (event) {
        this.props.onNewMenuItemChange(Object.assign({}, this.props.menuItem, {
            name: event.target.value
        }));
    },
    onEmailChange: function (event) {
        this.props.onNewMenuItemChange(Object.assign({}, this.props.menuItem, {
            email: event.target.value
        }));
    },
    onSubmit: function (event) {

    },
    render: function () {
        return (
            React.createElement('div', {},
                React.createElement(NavMenu, {}),
                React.createElement('form', {},
                    React.createElement('input', {
                        type: 'text',
                        placeholder: 'Name',
                        value: this.props.menuItem.name,
                        onChange: this.onNameChange
                    }),
                    React.createElement('input', {
                        type: 'text',
                        placeholder: 'Email',
                        value: this.props.menuItem.email,
                        onChange: this.onEmailChange
                    }),
                    React.createElement('button', {
                        type: 'button',
                        onChange: this.onSubmit
                    }, 'Submit')
                )
            )
        );
    }
});

var state = {};

function setState(changes) {

    state = Object.assign({}, state, changes);

    state.onItemDeleted = function (e) {
        var itemId = e.target.id.split('-')[1];

        var newListOfItems = [];

        for (var i = 0; i < state.items.length; i++) {
            if (state.items[i].id != itemId) {
                newListOfItems.push(state.items[i]);
            }
        }

        setState({
            items: newListOfItems
        });
    };

    var component = '';
    var componentProperties = {};
    if (state.location == '#new') {
        component = New;
        componentProperties = {
            menuItem: state.menuItem,
            onNewMenuItemChange: function (i) {
                setState({
                    menuItem: i
                });
            }
        };
    } else {
        component = List;
        componentProperties = {
            items: state.items
        };
    }

    var mainView = React.createElement(component, componentProperties);

    ReactDOM.render(mainView, document.getElementById('react-app'));
}

window.addEventListener('hashchange', () => setState({
    location: location.hash
}));

setState({
    items: items,
    menuItem: {
        name: '',
        email: ''
    }
});