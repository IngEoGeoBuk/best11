import React from 'react'
import { 
    CardMedia, 
    CardContent, 
    Typography
} from '@material-ui/core';
import { PlayerType } from '../types'

const PlayerBox = ({ _id , no, name, club, logo } : PlayerType) => {
    return (
        <div>
            <CardMedia>
                {logo ? <img src={logo} /> : <div></div>}
            </CardMedia>
            <CardMedia>
                {no ? <img src={`../players/player${no}.jpg`} /> : <div></div>}
            </CardMedia>
            <CardContent>
                {name ? <Typography style={{ fontSize: '0.8rem' }}>{name}</Typography> : <div></div>}
            </CardContent>
        </div>
    )
}

export default PlayerBox
