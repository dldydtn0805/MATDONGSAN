import { Button, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import styles from '../../styles/modals/ReviewSearchTogether.module.css';
import reviewFilterStore from '../../stores/reviewFilterStore';
import userStore from '../../stores/userStore';
import urlStore from '../../stores/urlStore';
import reviewStore from '../../stores/reviewStore';

function ReviewsSearchTogether(props) {
  const { setClicked, whatIsClicked } = props;
  const { setRefresh, refresh } = reviewStore();
  return (
    <span>
      <Button
        type="button"
        onClick={() => {
          setTimeout(() => {
            setRefresh(!refresh);
          }, 5);
          if (whatIsClicked === 1) {
            setClicked(0);
          } else {
            setClicked(1);
          }
        }}
        size="small"
        variant="contained"
        style={{
          borderRadius: '20px',
          backgroundColor:
            whatIsClicked === 1
              ? 'rgba(29, 177, 119, 0.7)'
              : '#ffffff',
          color: whatIsClicked === 1 ? '#FFFFFF' : '#555558',
          paddingTop: '0px',
          paddingBottom: '0px',
          marginLeft: '3px',
          marginRight: '3px',
        }}
      >
        친구
        <ExpandMoreIcon sx={{ width: '10px' }} />
      </Button>
    </span>
  );
}

function TogetherModal() {
  const { userID } = useParams();
  const { loginAccount } = userStore();
  const {
    selectedFriend,
    setSelectedFriend,
    setSelectedFriendID,
    selectedGuestFriends,
    setSelectedGuestFriends,
    setSelectedGuestFriendIds,
  } = reviewFilterStore();
  const currentPageID =
    userID === undefined ? loginAccount?.id : userID;
  const { refresh } = reviewStore();
  const { API_URL } = urlStore();
  const handleAutocompleteChange = (event, selectedOptions) => {
    // 선택된 항목을 setSelectedFriend 함수의 인자로 전달
    setSelectedFriend(
      selectedOptions.map((option) => ({
        name: option.title,
        picture: option.picture,
      }))
    );
    setSelectedFriendID(selectedOptions.map((option) => option.id));
  };
  const handleGuestFriend = (event, selectedOptions) => {
    setSelectedGuestFriends(
      selectedOptions.map((option) => option.title)
    );
    setSelectedGuestFriendIds(
      selectedOptions.map((option) => option.id)
    );
  };
  const [allFriends, setAllFriends] = useState([]);
  const [guestFriend, setGuestFriend] = useState([]);
  useEffect(() => {
    axios //
      .get(`${API_URL}/subscription/${currentPageID}`) // 1에서 로그인한 아이디로 수정
      .then((response) => {
        setAllFriends(
          response.data?.map((x) => ({
            title: x.nickname,
            id: x.id,
            picture: x.picture,
          }))
        );

        // 성공 시 필요한 작업 수행
      })
      .catch(() => undefined);
    axios //
      .get(`${API_URL}/account/tag/${currentPageID}`) // 1에서 로그인한 아이디로 수정
      .then((response2) => {
        setGuestFriend(
          response2.data?.map((x) => ({ title: x.name, id: x.id }))
        );

        // 성공 시 필요한 작업 수행
      })
      .catch(() => undefined);
  }, [refresh]);

  return (
    <div className={styles.wrapper}>
      <div>
        <Autocomplete
          multiple
          id="tags-outlined"
          options={allFriends}
          getOptionLabel={(option) => option.title}
          size="small"
          filterSelectedOptions
          onChange={handleAutocompleteChange}
          sx={{
            width: '150px',
            '& .MuiInputBase-root': {
              padding: '1px',
              paddingTop: '4px',
              // borderBottom: '1px solid rgba(0, 0, 0, 0.4)',
              borderRadius: '0',
              '&:hover': {
                // borderBottom: '1px solid rgba(0, 0, 0, 0.5)',
              },
              fontSize: '14px',
              color: 'rgba(29, 177, 119)',
              // border: '1px dashed red',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
            '& .MuiInput-root::after': {
              borderBottom: '2px solid rgba(29, 177, 119, 0.5)',
            },
          }}
          renderInput={(params) => (
            <TextField
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...params}
              label="계정이 있는 친구"
              variant="standard"
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon
                      style={{ color: 'rgba(217, 217, 217)' }}
                    />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                style: {
                  fontSize: '14px',
                  color: 'rgba(217, 217, 217)',
                  paddingLeft: '0px',
                },
              }}
            />
          )}
        />

        <Button
          type="submit"
          onClick={() => {
            setSelectedFriend([]);
            setSelectedFriendID([]);
          }}
          sx={{
            color: 'black',
            backgroundColor: 'rgba(217, 217, 217, 0.4)',
          }}
        >
          초기화
        </Button>
        <div>
          {selectedFriend.map((x, i) => (
            <div className={styles.content} key={selectedFriend[i]}>
              <Avatar
                alt="Remy Sharp"
                src={`/assets/random/profile${x.picture}.png`}
                sx={{ backgroundColor: 'rgba(29, 177, 119, 0.3)' }}
              />

              <p className={styles.item}>{x.name}</p>
              <hr />
            </div>
          ))}
        </div>
      </div>
      <div>
        <Autocomplete
          multiple
          id="tags-outlined"
          options={guestFriend}
          getOptionLabel={(option) => option.title}
          size="small"
          filterSelectedOptions
          onChange={handleGuestFriend}
          sx={{
            width: '150px',
            '& .MuiInputBase-root': {
              padding: '1px',
              paddingTop: '4px',
              // borderBottom: '1px solid rgba(0, 0, 0, 0.4)',
              borderRadius: '0',
              '&:hover': {
                // borderBottom: '1px solid rgba(0, 0, 0, 0.5)',
              },
              fontSize: '14px',
              color: 'rgba(29, 177, 119)',
              // border: '1px dashed red',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
            '& .MuiInput-root::after': {
              borderBottom: '2px solid rgba(29, 177, 119, 0.5)',
            },
          }}
          renderInput={(params) => (
            <TextField
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...params}
              label="계정이 없는 친구"
              variant="standard"
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon
                      style={{ color: 'rgba(217, 217, 217)' }}
                    />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                style: {
                  fontSize: '14px',
                  color: 'rgba(217, 217, 217)',
                  paddingLeft: '0px',
                },
              }}
            />
          )}
        />

        <div>
          {selectedGuestFriends.map((x, i) => (
            <div
              className={styles.content}
              key={selectedGuestFriends[i]}
            >
              <p className={styles.item}>{x}</p>
              <hr />
            </div>
          ))}
        </div>
        <Button
          type="submit"
          onClick={() => {
            setSelectedGuestFriends([]);
            setSelectedGuestFriendIds([]);
          }}
          sx={{
            color: 'black',
            backgroundColor: 'rgba(217, 217, 217, 0.4)',
          }}
        >
          초기화
        </Button>
      </div>
    </div>
  );
}
export { ReviewsSearchTogether, TogetherModal };
