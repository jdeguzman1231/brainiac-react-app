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