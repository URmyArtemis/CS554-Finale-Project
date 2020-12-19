import React, { useContext } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { AuthContext } from '../firebase/Auth';
import queries from '../queries';
import { Card, CardActionArea, CardContent, CardMedia, Grid, Typography, makeStyles, Button } from '@material-ui/core';
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

const MyBin = (props) => {
    const classes = useStyles();
    const { currentUser } = useContext(AuthContext);
    const { data, loading, error } = useQuery(queries.GET_BINNEDBUSINESSES, {
        variables: {
            uid: currentUser.uid
        }
    });
    const [updateBusiness] = useMutation(queries.UPDATE_BUSINESS, {
        update(cache, { data: { updateBusiness } }) {
            const { binnedBusinesses } = cache.readQuery({
                query: queries.GET_BINNEDBUSINESSES,
                variables: {
                    uid: currentUser.uid
                }
            });
            cache.writeQuery({
                query: queries.GET_BINNEDBUSINESSES,
                variables: {
                    uid: currentUser.uid
                },
                data: { binnedBusinesses: binnedBusinesses.filter((e) => e.id !== updateBusiness.id) }
            });
        }
    });
    let card = null;

    const buildCard = (business) => {
        return (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={business.id}>
                <Card className={classes.card} variant='outlined'>
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
                            rating: {business.rating ? business.rating : 'N/A'}
                            <br />
                                price: {business.pric ? business.price : 'N/A'}
                            <br />
                            {business.location[0]}, {business.location[1]}
                        </Typography>
                        <Button variant='contained' color='primary' onClick={(e) => {
                            updateBusiness({
                                variables: {
                                    uid: currentUser.uid,
                                    id: business.id,
                                    binned: false
                                }
                            });
                        }}>Remove From Bin</Button>
                    </CardContent>
                </Card>
            </Grid>
        )
    }

    if (loading) {
        return <div>Loading...</div>
    } else if (error) {
        return <div>{error.message}</div>
    }

    const { binnedBusinesses } = data;
    card = binnedBusinesses.map((business) => {
        return buildCard(business);
    });

    return (
        <div>
            <Grid container className={classes.grid} spacing={5}>
                {card}
            </Grid>
        </div>
    )
}

export default MyBin;