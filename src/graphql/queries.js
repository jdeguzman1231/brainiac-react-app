import {gql} from '@apollo/client'


export const tagnames = ['Astronomy', 'Computer Science', 'English', 'Geology', 'Geography','History', 'Language',
'Math', 'Movies', 'Science', 'Sports']

export const FETCH_PLATFORM_QUERY = gql`
query($platformID: Int!){
    getPlatform(platformID: $platformID){
        name
        creatorName
        description
        games
        photo
        tags
    }
}  
`;
export const FETCH_PLATFORMS_QUERY = gql`

    {
    getPlatforms{
        platformID name creatorName description photo, tags
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