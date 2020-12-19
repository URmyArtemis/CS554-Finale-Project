import React, { useContext } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { AuthContext } from '../firebase/Auth';
import queries from '../queries';
import Reviews from './Reviews';
import { makeStyles, Card, CardContent, CardMedia, Typography, CardHeader, Button } from '@material-ui/core';
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
    const { currentUser } = useContext(AuthContext);
    const binnedResponse = useQuery(queries.GET_BINNEDBUSINESSES, {
        variables: {
            uid: currentUser.uid
        }
    });
    const businessResponse = useQuery(queries.GET_SINGLEBUSINESS, {
        variables: {
            id: props.match.params.id
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
            if (ifBinned) {
                cache.writeQuery({
                    query: queries.GET_BINNEDBUSINESSES,
                    variables: {
                        uid: currentUser.uid
                    },
                    data: { binnedBusinesses: binnedBusinesses.concat([updateBusiness]) }

                });
            } else {
                cache.writeQuery({
                    query: queries.GET_BINNEDBUSINESSES,
                    variables: {
                        uid: currentUser.uid
                    },
                    data: { binnedBusinesses: binnedBusinesses.filter((e) => e.id !== updateBusiness.id) }
                });
            }
        }
    });
    let ifBinned = false;


    if (binnedResponse.loading || businessResponse.loading) {
        return <div>Loading...</div>
    } else if (binnedResponse.error) {
        return <div>{binnedResponse.error.message}</div>
    } else if (businessResponse.error) {
        return <div>{businessResponse.error.message}</div>
    }

    const { binnedBusinesses } = binnedResponse.data;
    const { singleBusiness } = businessResponse.data;

    binnedBusinesses.map((business) => {
        if (business.id === singleBusiness.id) {
            ifBinned = true;
        }
        return business;
    });


    return (
        <Card className={classes.card} variant='outlined'>
            <CardHeader className={classes.titleHead} title={singleBusiness.name} />
            <Button variant='contained' color='primary' onClick={(e) => {
                updateBusiness({
                    variables: {
                        uid: currentUser.uid,
                        id: singleBusiness.id,
                        binned: !ifBinned
                    }
                });
                ifBinned = !ifBinned;
            }}>{ifBinned ? 'Remove from bin' : 'Add to bin'}</Button>
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
                        <div>
                            <dt className="title">reveiws:</dt>
                            <dd>
                                <Reviews alias={singleBusiness.alias} />
                            </dd>
                        </div>
                    </dl>
                </Typography>
            </CardContent>
        </Card>
    )
};

export default Business;
