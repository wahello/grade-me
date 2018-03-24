import * as React from 'react';
import * as classNames from 'classnames';
import {Toolbar, Tooltip, IconButton, Typography} from 'material-ui';
import DeleteIcon from 'material-ui-icons/Delete';
import EditIcon from 'material-ui-icons/Edit';
import CreateIcon from 'material-ui-icons/Add';
import OpenIcon from 'material-ui-icons/FolderOpen';
import FilterListIcon from 'material-ui-icons/FilterList';
import {StyleRulesCallback, Theme, withStyles, WithStyles} from 'material-ui/styles';
import {lighten} from 'material-ui/styles/colorManipulator';

export interface IMyTableToolbarProps {
    title: string;
    numSelected: number;
    onAdd?: React.MouseEventHandler<HTMLButtonElement>;
    onEdit?: React.MouseEventHandler<HTMLButtonElement>;
    onDelete?: React.MouseEventHandler<HTMLButtonElement>;
    onOpen?: React.MouseEventHandler<HTMLButtonElement>;
}

export interface IMyTableToolbarState {

}

type MyTableToolbarPropsWithStyles = IMyTableToolbarProps &
    WithStyles<'root' | 'highlight' | 'spacer' | 'actions' | 'title'>;

const toolbarStyles: StyleRulesCallback = (theme: Theme) => ({
    root: {
        paddingRight: theme.spacing.unit
    },
    highlight: theme.palette.type === 'light' ? {
        color: theme.palette.secondary.dark,
        backbroundColor: lighten(theme.palette.secondary.light, .4)
    } : {
        color: lighten(theme.palette.secondary.light, .4),
        backbroundColor: theme.palette.secondary.dark
    },
    spacer: {
        flex: '1 1 100%'
    },
    actions: {
        color: theme.palette.text.secondary,
        display: 'flex',
        flexDirection: 'row'
    },
    title: {
        flex: '0 0 auto'
    }
});

class MyTableToolbarWithStyles extends React.Component<MyTableToolbarPropsWithStyles, IMyTableToolbarState> {
    constructor(props: MyTableToolbarPropsWithStyles) {
        super(props);
    }

    public render() {
        const {title, numSelected, classes, onAdd} = this.props;
        return (
            <Toolbar
                className={classNames(classes.root, {
                    [classes.highlight]: numSelected > 0
                })}
            >
                <div className={classes.title}>
                    {numSelected > 0 ? (
                        <Typography variant='subheading'>
                            {numSelected} selected
                        </Typography>
                    ) : (
                        <Typography variant='title'>
                            {title}
                        </Typography>
                    )}
                </div>
                <div className={classes.spacer}/>
                <div className={classes.actions}>
                    {numSelected === 1 && (
                        <Tooltip title='Open'>
                            <IconButton aria-label='Open' onClick={this.onOpen}>
                                <OpenIcon/>
                            </IconButton>
                        </Tooltip>
                    )}
                    {numSelected === 1 && (
                        <Tooltip title='Edit'>
                            <IconButton aria-label='Edit' onClick={this.onEdit}>
                                <EditIcon/>
                            </IconButton>
                        </Tooltip>
                    )}
                    {onAdd && <Tooltip title='Create'>
                        <IconButton onClick={this.onAdd} aria-label='Create'>
                            <CreateIcon/>
                        </IconButton>
                    </Tooltip>}
                    {numSelected > 0 ? (
                        <Tooltip title='Delete'>
                            <IconButton aria-label='Delete' onClick={this.onDelete}>
                                <DeleteIcon/>
                            </IconButton>
                        </Tooltip>
                    ) : (
                        <Tooltip title='Filter list'>
                            <IconButton aria-label='Filter list'>
                                <FilterListIcon/>
                            </IconButton>
                        </Tooltip>
                    )}
                </div>
            </Toolbar>
        );
    }

    private onAdd: React.MouseEventHandler<HTMLButtonElement> = e => {
        this.props.onAdd(e);
    }

    private onDelete: React.MouseEventHandler<HTMLButtonElement> = e => {
        this.props.onDelete(e);
    }

    private onEdit: React.MouseEventHandler<HTMLButtonElement> = e => {
        this.props.onEdit(e);
    }

    private onOpen: React.MouseEventHandler<HTMLButtonElement> = e => {
        this.props.onOpen(e);
    }
}

const MyTableToolbar = withStyles(toolbarStyles)<IMyTableToolbarProps>(MyTableToolbarWithStyles);

export {MyTableToolbar};