import {gql} from '@apollo/client'

export const EDIT_PLATFORM = gql`
    mutation EditPlatform(
        $platformID: Int!
        $creatorName: String!
        $name: String!
        $description: String!
        $private: Boolean!
        ){
            editPlatform(platformID: $platformID, creatorName: $creatorName, name: $name, description: $description, private: $private)
              
            
                
            
        }
`;