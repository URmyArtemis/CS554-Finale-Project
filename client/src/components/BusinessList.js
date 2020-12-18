import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import SearchBusinesses from './SearchBusinesses'
import queries from '../queries';
import { Card, CardActionArea, CardContent, CardMedia, Grid, Typography, makeStyles } from '@material-ui/core';
import '../App.css';

const useStyles = makeStyles({
    card: {
        maxWidth: 250,
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

const BusinessList = (props) => {
    const classes = useStyles();
    const [term, setTerm] = useState(undefined);
    const [location, setLocation] = useState('Hoboken');
    const { data, loading, error } = useQuery(queries.GET_YELPBUSINESSES, {
        variables: {
            term: term,
            location: location
        }
    });
    let card = null;

    const searchTerm = (term) => {
        setTerm(term);
    }

    const searchLocation = (location) => {
        setLocation(location);
    }

    const buildCard = (business) => {
        return (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={business.id}>
                <Card className={classes.card} variant='outlined'>
                    <CardActionArea>
                        <Link to={`/businesses/${business.id}`}>
                            <CardMedia
                                className={classes.media}
                                component='img'
                                image={business.image_url}
                                title='business image'
                            />

                            <CardContent>
                                <Typography className={classes.titleHead} gutterBottom variant='h6' component='h3'>
                                    {business.name}
                                </Typography>
                                <Typography variant='body2' color='textSecondary' component='p'>
                                    rating: {business.rating}
                                    <br />
                                    price: {business.price}
                                    <br />
                                    {business.location[0]}, {business.location[1]}
                                </Typography>
                            </CardContent>
                        </Link>
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

    const { yelpBusinesses } = data;
    card = yelpBusinesses.map((business) => {
        return buildCard(business);
    });

    return (
        <div>
            <SearchBusinesses searchTerm={searchTerm} searchLocation={searchLocation} />
            <br />
            <br />
            <Grid container className={classes.grid} spacing={5}>
                {card}
            </Grid>
        </div>
    )

};

export default BusinessList;