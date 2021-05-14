import {gql} from '@apollo/client'

export const FETCH_PLATFORM_QUERY = gql`
query($platformID: Int!){
    getPlatform(platformID: $platformID){
        name
        creatorName
        description
        games
    }
}  
`;
export const FETCH_PLATFORMS_QUERY = gql`

    {
    getPlatforms{
        platformID name creatorName description
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
