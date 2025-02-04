import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
import './UserProfile.sass';
import { TableTemplate } from '../../components/tableTemplate';
import {
  fetchCandidatesByUser,
  fetchInternships,
  fetchAllUsers,
} from '../../store/commands';
import {
  getFieldLabel,
  tableFillerCandidates,
  tableFiller,
  tableFillerAllUsers,
} from '../../utils';
import { userProfileListFields } from '../../constants/userProfileListFields';
import { useMediaDown } from '../../components/utils';
import { header, headerMobile } from '../../constants/calendarHeader';
import { Calendar } from '../../components/calendar';
import { loadingSelector } from '../../store/selectors';
import { LoadingIndicator } from '../../components/loadingIndicator';
import { TableTemplateCandidates } from '../../components/tableTemplateCandidates';
import { TableTemplateInternship } from '../../components/tableTemplateInternship';

const UserProfile = () => {
  const userInfo = useSelector((state) => state.userInfo.userInfo);
  const internships = useSelector((state) => state.internships.internships);
  const allUsers = useSelector((state) => state.allUsers.allUsers);
  const assignCandidates = useSelector(
    (state) => state.assignUserCandidates.assignUserCandidates,
  );
  const dispatch = useDispatch();
  const isLoading = useSelector(
    loadingSelector(
      ['GET_USER_INFO'],
      ['GET_INTERNSHIPS'],
      ['POST_CANDIDATES_BY_USER'],
    ),
  );
  useEffect(() => {}, [isLoading]);

  useEffect(() => {
    if (userInfo.length !== 0) {
      if (userInfo.roleType === 'Admin' || userInfo.roleType === 'Manager') {
        dispatch(fetchInternships());
        dispatch(fetchAllUsers());
      } else {
        dispatch(fetchCandidatesByUser(userInfo.id));
        if (userInfo.roleType === 'Hr') {
          dispatch(fetchInternships());
        }
      }
    }
  }, []);
  const mobile = useMediaDown('md');
  const large = useMediaDown('lg');
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
              {userInfo.roleType === 'Admin' ||
              userInfo.roleType === 'Manager' ? (
                <TableTemplate
                  rowData={tableFillerAllUsers(allUsers)}
                />
              ) : (
                <TableTemplateCandidates
                  rowData={tableFillerCandidates(assignCandidates)}
                />
              )}
            </Card>
          </Box>
          <Box className={large ? 'calendarMobile' : 'calendar'}>
            <Card className={mobile ? 'calendarCardMobile' : 'calendarCard'}>
              {userInfo.roleType === 'Interviewer' ? (
                <Calendar
                  headerType={mobile ? headerMobile : header}
                  email={userInfo.email}
                />
              ) : (
                <TableTemplateInternship
                  rowData={ userInfo.roleType === 'Admin' || userInfo.roleType === 'Manager' ? internships : tableFiller(userInfo, internships)}
                />
              )}
            </Card>
          </Box>
        </Box>
      )}
    </>
  );
};

export default UserProfile;
