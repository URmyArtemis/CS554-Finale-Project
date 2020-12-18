import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import queries from '../queries';
import { Card, CardActionArea, CardContent, CardMedia, Grid, Typography, makeStyles } from '@material-ui/core';
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
    // const info = 根据ID查business
    const { data, loading, error } = useQuery(queries.GET_BUSINESSREVIEWS, {
        variables: {
            alias: props.match.params.id
        }
    });
    let card = null;

    const buildCard = (business) => {
        return (
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} key={business.id}>
                <Card className={classes.card} variant='outlined'>
                    <CardActionArea>
                        <CardContent>
                            <Typography className={classes.titleHead} gutterBottom variant='h6' component='h3'>
                                {business.username}
                            </Typography>
                            <Typography variant='body2' color='textSecondary' component='p'>
                                rating: {business.rating}
                                <br />
                                {business.text}
                                <br />
                                created at: {business.time_created}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
        )
    }

    if (loading) {
        return <div>Loading...</div>
    } else if (error) {
        return <div>{error.message}</div>
    }

    const { businessReviews } = data;
    console.log(data)
    card = businessReviews.map((business) => {
        return buildCard(business);
    });

    return (
        <div>
            { props.match.params.id}
            <Grid container className={classes.grid} spacing={5}>
                {card}
            </Grid>
        </div>
    )



};

export default Business;
