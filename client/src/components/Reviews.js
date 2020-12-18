import React from 'react';
import { useQuery } from '@apollo/client';
import queries from '../queries';
import '../App.css';

const Reviews = (props) => {
    const { data, loading, error } = useQuery(queries.GET_BUSINESSREVIEWS, {
        variables: {
            alias: props.alias
        }
    })

    if (loading) {
        return <div>Loading...</div>
    } else if (error) {
        return <div>{error.message}</div>
    }

    const { businessReviews } = data;

    return (
        <ol>
            {businessReviews.map((review) => {
                return (
                    <li key={review.id}>
                        <p>text: {review.text}</p>
                        <p>rating: {review.rating}</p>
                        <p>postedby: {review.username}</p>
                        <p>time_created: {review.time_created}</p>
                        <br />
                    </li>
                )
            })}

        </ol>
    )
}

export default Reviews;