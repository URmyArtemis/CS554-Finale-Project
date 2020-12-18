import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import queries from '../queries';
import Reviews from './Reviews';
import { makeStyles, Card, CardContent, CardMedia, Typography, CardHeader } from '@material-ui/core';
import '../App.css';

const useStyles = makeStyles({
    card: {
        maxWidth: 550,
        height: 'auto',
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: 5,
        border: '1px solid #1e8678',
        boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
    },
    titleHead: {
        borderBottom: '1px solid #1e8678',
        fontWeight: 'bold'
    },
    grid: {
        flexGrow: 1,
        flexDirection: 'row'
    },
    media: {
        height: '100%',
        width: '100%'
    },
    button: {
        color: '#1e8678',
        fontWeight: 'bold',
        fontSize: 12
    }
});

const Business = (props) => {
    const classes = useStyles();
    const { data, loading, error } = useQuery(queries.GET_SINGLEBUSINESS, {
        variables: {
            id: props.match.params.id
        }
    });

    if (loading) {
        return <div>Loading...</div>
    } else if (error) {
        return <div>{error.message}</div>
    }

    const { singleBusiness } = data;

    return (
        <Card className={classes.card} variant='outlined'>
            <CardHeader className={classes.titleHead} title={singleBusiness.name} />
            <CardMedia
                className={classes.media}
                component='img'
                image={singleBusiness.image_url}
                title='business image'
            />

            <CardContent>
                <Typography variant='body2' color='textSecondary' component='span'>
                    <dl>
                        <p>
                            <dt className="title">rating:</dt>
                            {singleBusiness.rating ? <dd>{singleBusiness.rating}</dd> : <dd>N/A</dd>}
                        </p>
                        <p>
                            <dt className="title">price:</dt>
                            {singleBusiness.price ? <dd>{singleBusiness.price}</dd> : <dd>N/A</dd>}
                        </p>
                        <p>
                            <dt className="title">display_phone:</dt>
                            {singleBusiness.display_phone ? <dd>{singleBusiness.display_phone}</dd> : <dd>N/A</dd>}
                        </p>
                        <p>
                            <dt className="title">location:</dt>
                            {singleBusiness.location ? <dd>{singleBusiness.location}</dd> : <dd>N/A</dd>}
                        </p>
                        <p>
                            <dt className="title">reveiws:</dt>
                            <dd>
                                <Reviews alias={singleBusiness.alias} />
                            </dd>
                        </p>
                    </dl>
                </Typography>
            </CardContent>
        </Card>
    )
};

export default Business;
