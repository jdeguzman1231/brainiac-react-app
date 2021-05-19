import {gql} from '@apollo/client'


export const tagnames = ['Astronomy', 'Computer Science', 'English', 'Geology', 'Geography','History', 'Language',
'Math', 'Movies', 'Science', 'Sports']

export const randcolor = ['https://res.cloudinary.com/dkgfsmwvg/image/upload/v1621306511/brainiac_data/pink_fjftyr.png', 'https://res.cloudinary.com/dkgfsmwvg/image/upload/v1621306508/brainiac_data/orange_rrsst1.jpg'
, 'https://res.cloudinary.com/dkgfsmwvg/image/upload/v1621306503/brainiac_data/green_mqvreq.jpg', 'https://res.cloudinary.com/dkgfsmwvg/image/upload/v1621306491/brainiac_data/gradred_twzgla.jpg'
, 'https://res.cloudinary.com/dkgfsmwvg/image/upload/v1621306488/brainiac_data/blue_eb35na.jpg' ]

export const default_profile_picture = 'https://res.cloudinary.com/dkgfsmwvg/image/upload/v1621309258/brainiac_data/pfpdef_qaxfzp.jpg'
export const FETCH_PLATFORM_QUERY = gql`
query($platformID: Int!){
    getPlatform(platformID: $platformID){
        name
        creatorName
        description
        games
        photo
        tags
        color1
        color2
    }
}  
`;
export const FETCH_PLATFORMS_QUERY = gql`

    {
    getPlatforms{
        platformID name creatorName description photo, tags, games
    }
}   
`;

export const FETCH_USER_QUERY = gql`
query($username: String!) {
    getUser(username: $username) 
    {
        username
        email
        name
        createdPlatforms
        playedPlatforms
        bookmarkedPlatforms
        profilePicture
        color
    }
}
`;
export const FETCH_USERS_QUERY = gql`
{
    getUsers
    {
        email
        username
        name
    }
}
`;

export const BOOKMARK_PLATFORM = gql`
    mutation bookmarkPlatform(
        $username: String!
        $platformID: Int!
    ) {
        bookmarkPlatform(
            username: $username
            platformID: $platformID
        )
    }
`;

export const UNBOOKMARK_PLATFORM = gql`
    mutation unbookmarkPlatform(
        $username: String!
        $platformID: Int!
    ) {
        unbookmarkPlatform(
            username: $username
            platformID: $platformID
        )
    }
`;

export const DELETE_PLATFORM = gql`
mutation deletePlatform(
    $username: String!
    $platformID: Int!
    ){
       deletePlatform(
            username: $username
            platformID: $platformID
        )
    }
`;
export const FETCH_GAME_QUERY = gql`
query($gameID: Int!){
    getGame(gameID: $gameID){
        name
        creatorName
        description
        parentPlatform
        tags
        pictures
    }
}
`;
