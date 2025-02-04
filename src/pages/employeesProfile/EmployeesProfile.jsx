import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  Box,
  Card,
  Avatar,
  Typography,
  Divider,
  ListItemText,
  List,
  ListItem,
} from '@mui/material';
import './EmployeesProfile.sass';
import {
  fetchInternships,
  fetchUserInfoById,
} from '../../store/commands';
import {
  getFieldLabel,
  tableFiller,
} from '../../utils';
import { userProfileListFields } from '../../constants/userProfileListFields';
import { useMediaDown } from '../../components/utils';
import { loadingSelector } from '../../store/selectors';
import { LoadingIndicator } from '../../components/loadingIndicator';
import { TableTemplateInternship } from '../../components/tableTemplateInternship';

const EmployeesProfile = () => {
  const userInfo = useSelector((state) => state.user.user);
  const internships = useSelector((state) => state.internships.internships);
  const { id } = useParams();
  const dispatch = useDispatch();
  const isLoading = useSelector(
    loadingSelector(
      ['GET_USER_INFO_BY_ID'],
      ['GET_INTERNSHIPS'],
    ),
  );
  useEffect(() => {}, [isLoading]);

  useEffect(() => {
    dispatch(fetchUserInfoById(id));
    dispatch(fetchInternships());
  }, []);
  const mobile = useMediaDown('md');
  return (
    <>
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <Box className={mobile ? 'pageWrapperMobile' : 'pageWrapper'}>
          <Box
            width={{ md: '40%', lg: '33%' }}
            className={mobile ? 'informationMobile' : 'information'}
          >
            <Card raised className="informationCard">
              <Box
                className={
                  mobile ? 'informationContainerMobile' : 'informationContainer'
                }
              >
                <Box className="avatarContainer">
                  <Avatar
                    className="avatarImg"
                    variant="square"
                    alt={userInfo.userName}
                  />
                </Box>
                <Box className="informationList">
                  <Typography
                    align="center"
                    className="text"
                    padding="10px 0px 10px 10px"
                    variant="h4"
                  >
                    {userInfo.userName}
                  </Typography>
                  <Divider />
                  <List>
                    {userProfileListFields.map((item) => (
                      <ListItem key={item}>
                        <ListItemText
                          primary={getFieldLabel(`profile.${item}`)}
                        />
                        <Typography
                          padding="0px 0px 0px 10px"
                          variant="body1"
                          className="text"
                        >
                          {userInfo && userInfo[item]}
                        </Typography>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Box>
            </Card>
          </Box>
          <Box
            width={{ md: '60%', lg: '33%' }}
            className={mobile ? 'activityMobile' : 'activity'}
          >
            <Card className="activityTab">
              <TableTemplateInternship
                  rowData={tableFiller(userInfo, internships)}
              />
            </Card>
          </Box>
        </Box>
      )}
    </>
  );
};

export default EmployeesProfile;
