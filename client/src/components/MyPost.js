import React, { useContext } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { AuthContext } from '../firebase/Auth';
import queries from '../queries';
import { Card, CardContent, Grid, Typography, makeStyles, Button } from '@material-ui/core';
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

const MyPost = (props) => {
    const classes = useStyles();
    const { currentUser } = useContext(AuthContext);
    const { data, loading, error } = useQuery(queries.GET_POSTEDREVIEWS, {
        variables: {
            uid: currentUser.uid
        }
    });
    const [deleteReview] = useMutation(queries.DELETE_REVIEW, {
        update(cache, { data: { deleteReview } }) {
            const { postedReviews } = cache.readQuery({
                query: queries.GET_POSTEDREVIEWS,
                variables: {
                    uid: currentUser.uid
                }
            });
            cache.writeQuery({
                query: queries.GET_POSTEDREVIEWS,
                variables: {
                    uid: currentUser.uid
                },
                data: { postedReviews: postedReviews.filter((e) => e.id !== deleteReview.id) }
            });
        }
    });
    let card = null;

    const buildCard = (review) => {
        return (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={review.id}>
                <Card className={classes.card} variant='outlined'>
                    <CardContent>
                        <Typography className={classes.titleHead} gutterBottom variant='h6' component='h3'>
                            {review.businessName}
                        </Typography>
                        <Typography variant='body2' color='textSecondary' component='p'>
                            rating: {review.rating}
                            <br />
                            text: {review.text}
                            <br />
                            {review.time_created}
                        </Typography>
                        <Button variant='contained' color='primary' onClick={(e) => {
                            deleteReview({
                                variables: {
                                    uid: currentUser.uid,
                                    businessAlias: review.businessAlias,
                                    id: review.id
                                }
                            });
                        }}>Delete This Review</Button>
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

    const { postedReviews } = data;
    card = postedReviews.map((review) => {
        return buildCard(review);
    });

    return (
        <div>
            <Grid container className={classes.grid} spacing={5}>
                {card}
            </Grid>
        </div>
    )
}

export default MyPost;