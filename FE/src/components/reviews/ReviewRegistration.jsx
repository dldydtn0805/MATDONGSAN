import TextField from '@mui/material/TextField';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import ClearIcon from '@mui/icons-material/Clear';
import Avatar from '@mui/material/Avatar';
import Swal from 'sweetalert2';
import reviewStore from '../../stores/reviewStore';
import styles from '../../styles/reviews/ReviewRegistration.module.css';
import content from '../../styles/foodmap/FoodMapView.module.css';
import ReviewRegistrationFriendTagModal from '../modals/ReviewRegistrationFriendTagModal';
import urlStore from '../../stores/urlStore';
import userStore from '../../stores/userStore';
import angel from '../../assets/images/reviews/angel.png';

function ReviewRegistration() {
  const { loginAccount } = userStore();
  // const [가게이름, 가게이름수정] = useState('');
  const [kindnessRating, setKindnessRating] = useState(0);
  const [tasteRating, setTasteRating] = useState(0);
  const [reviewContent, setReviewContent] = useState('');
  const [companionFriends, setCompanionFriends] = useState([]);
  const [guestFriendName, setGuestFriendName] = useState('');
  const [guestFriendBirthYear, setGuestFriendBirthYear] = useState(
    dayjs(dayjs().format('YYYY-MM-DD'))
  );
  const [selectedVisitDate, setSelectedVisitDate] = useState(
    dayjs(dayjs().format('YYYY-MM-DD'))
  );

  const [guestFriends, setGuestFriends] = useState([]);
  const [selectedAccountFriends, setSelectedAccountFriends] =
    useState([]);
  const [allFriends, setAllFriends] = useState([]);
  const { setRefresh, refresh } = reviewStore();
  const { API_URL } = urlStore();
  useEffect(
    () => () => {
      // Axios 요청을 보내서 리뷰 리스트를 갱신할 예정입니다 (useEffect 안에 적는 코드들은 어려운 연산 / 서버에서 데이터 가져오는 작업),
      // 따라서 Dependency에 []를 넣고 unmount 됐을때 한번만 처리할 예정입니다
      setGuestFriends([]);
    },
    []
  );
  const { restaurantStore } = reviewStore();
  const { restaurantID } = useParams();
  const [restaurantId, setRestaurantId] = useState();
  useEffect(() => {
    // useparams에 restaurantID가 있을 경우에 레스토랑 아이디를 할당함
    if (restaurantID !== undefined) {
      setRestaurantId(restaurantID);
    }
  });
  const [isGuestFriendModalOpen, setIsGuestFriendModalOpen] =
    useState(false);
  const navigate = useNavigate();
  const handleAutocompleteChange = (event, selectedOptions) => {
    // 선택된 항목을 setSelectedFriend 함수의 인자로 전달

    setCompanionFriends(
      selectedOptions?.map((option) => ({
        name: option.title,
        picture: option.picture,
      }))
    );
    setSelectedAccountFriends(
      selectedOptions?.map((option) => ({
        id: option.id,
      }))
    );
  };
  const filteredShop = restaurantStore.find(
    (x) => x.id === Number(restaurantId)
  );

  const restaurants = restaurantStore.map((x) => ({
    label: x.restaurantName,
  }));
  useEffect(() => {
    axios //
      .get(`${API_URL}/subscription/${loginAccount.id}`) // 1에서 로그인한 아이디로 수정
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
  }, []);
  // const camelToSnakeCase = str => str.replace(/[A-Z]/g, letter => _${letter.toLowerCase()});
  return (
    <div>
      <div className={content.hiddenSpace}>
        <div className={styles.container}>
          <div>
            <div className={styles.header}>
              {restaurantID == null ? (
                <Autocomplete
                  disablePortal
                  disableClearable
                  id="combo-box-demo"
                  options={restaurants.map((option) => option.label)}
                  onChange={(e, name) => {
                    const autoCompletedShop = restaurantStore.find(
                      (x) => x.restaurantName === name
                    );
                    setRestaurantId(autoCompletedShop.id);
                  }}
                  sx={{
                    width: 'auto',
                    height: 50,
                    marginTop: '2vh',
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline':
                        {
                          borderColor: 'rgba(29, 177, 119, 0.5)', // 클릭되었을 때 테두리 색상
                        },
                    },
                    '& .MuiInputLabel-outlined.MuiInputLabel-shrink':
                      {
                        color: 'rgba(29, 177, 119, 0.5)', // 텍스트가 상단으로 이동할 때의 색상
                      },
                  }}
                  renderInput={(params) => (
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    <TextField {...params} label="가게이름" />
                  )}
                />
              ) : (
                <div>{filteredShop?.restaurantName}</div>
              )}

              <CloseIcon
                onClick={() => {
                  navigate('/main/restaurants');
                }}
                sx={{
                  position: 'absolute',
                  right: '1vw',
                  top: '2vh',
                  width: '18px',
                  '&:hover': {
                    cursor: 'pointer',
                  },
                }}
              />
            </div>
            <hr />
            <div className={styles.rating}>
              {/* <div>
                   <img src={employee} alt="" width={50} />
                   </div> */}
              <div>
                <Typography
                  component="legend"
                  sx={{ color: 'rgba(55,55,55,0.7)' }}
                >
                  친절
                </Typography>
                <Rating
                  name="simple-controlled"
                  value={kindnessRating}
                  onChange={(event, newValue) => {
                    setKindnessRating(Number(newValue));
                  }}
                  sx={{ color: 'rgba(29, 177, 119, 0.7)' }}
                />
              </div>
            </div>
            <div className={styles.rating}>
              {/* <img src={tongue} alt="" width={50} /> */}
              <div>
                <Typography
                  component="legend"
                  sx={{ color: 'rgba(55,55,55,0.7)' }}
                >
                  맛
                </Typography>
                <Rating
                  name="simple-controlled"
                  value={tasteRating}
                  onChange={(event, newValue) => {
                    setTasteRating(Number(newValue));
                  }}
                  sx={{ color: 'rgba(29, 177, 119, 0.7)' }}
                />
              </div>
            </div>
            {tasteRating > 4 && kindnessRating > 4 && (
              <div className={styles.angel}>
                <img src={angel} alt="" width={100} />
              </div>
            )}

            <TextField
              id="outlined-multiline-static"
              label=""
              multiline
              rows={20}
              fullWidth
              className={styles.textFieldStyle}
              placeholder="당신의 이야기를 남기세요...."
              onChange={(e) => {
                setReviewContent(e.target.value);
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: 'rgba(29, 177, 119, 0.5)',
                  }, // 텍스트필드 색상 바꾸는 CSS
                },
                '& input::placeholder': {
                  textAlign: 'center',
                  marginRight: '30px',
                },
              }}
            />

            <hr />
            <Typography
              component="legend"
              sx={{ color: 'rgba(55,55,55,0.7)' }}
            >
              같이 방문한 친구
            </Typography>
            <div className={styles.friend}>
              <Autocomplete
                multiple
                id="tags-outlined"
                options={allFriends}
                getOptionLabel={(option) => option.title}
                size="small"
                filterSelectedOptions
                onChange={handleAutocompleteChange}
                sx={{
                  width: 300,
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline':
                      {
                        borderColor: 'rgba(29, 177, 119, 0.5)', // 클릭되었을 때 테두리 색상
                      },
                  },
                  '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
                    color: 'rgba(29, 177, 119, 0.5)', // 텍스트가 상단으로 이동할 때의 색상
                  },
                }}
                renderInput={(params) => (
                  <TextField
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...params}
                    label="검색"
                    placeholder=""
                    sx={{
                      textAlign: 'center',
                      display: 'block',
                    }}
                  />
                )}
              />

              <Button
                type="button"
                variant="contained"
                size="small"
                sx={{ width: '100px' }}
                onClick={() => {
                  setIsGuestFriendModalOpen(!isGuestFriendModalOpen);
                }}
                style={{
                  backgroundColor: 'rgba(29, 177, 119, 0.7)', // 버튼의 배경색을 1db177로 설정
                  color: '#ffffff', // 버튼의 글자색을 흰색으로 설정
                  fontSize: '0.5rem', // 버튼의 글자 크기를 조절
                  borderRadius: '5px',
                  marginLeft: '30px',
                  maxHeight: '30px',
                }}
              >
                계정없는친구
              </Button>
              <img src="" alt="" />
            </div>
            <div>
              {companionFriends.map((x) => (
                <div className={styles.content}>
                  <Avatar
                    alt="Remy Sharp"
                    src={`/assets/random/profile${x.picture}.png`}
                    sx={{
                      backgroundColor: 'rgba(29, 177, 119, 0.3)',
                    }}
                  />

                  <p className={styles.item}>{x.name}</p>
                  <hr />
                </div>
              ))}
            </div>
            {isGuestFriendModalOpen ? (
              <ReviewRegistrationFriendTagModal
                임의친구이름={guestFriendName}
                임의친구이름수정={setGuestFriendName}
                임의친구생년={guestFriendBirthYear}
                임의친구생년수정={setGuestFriendBirthYear}
                임의친구들={guestFriends}
                임의친구들수정={setGuestFriends}
                클릭버튼={isGuestFriendModalOpen}
                클릭버튼수정={setIsGuestFriendModalOpen}
              />
            ) : null}
            <hr />
            <Typography
              component="legend"
              sx={{ color: 'rgba(55,55,55,0.7)' }}
            >
              계정 없는 친구 태그
            </Typography>
            <div className={styles.tag}>
              {guestFriends.map((x, i) => (
                <div key={x[i]}>
                  <span className={styles.item}>{x.name}</span>
                  <span>/</span>
                  <span>{x.birthYear}</span>
                  <IconButton
                    onClick={() => {
                      const updatedGuestFriends = guestFriends.filter(
                        (y) => y.name !== x.name
                      );
                      setGuestFriends(updatedGuestFriends);
                    }}
                  >
                    <ClearIcon />
                  </IconButton>
                </div>
              ))}
            </div>
            <hr />
            <Typography
              component="legend"
              sx={{ color: 'rgba(55,55,55,0.7)' }}
            >
              방문한 날짜
            </Typography>
            <div className={styles.date}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                  <DatePicker
                    size="small"
                    label="방문 날짜"
                    value={selectedVisitDate}
                    maxDate={dayjs(dayjs().format('YYYY-MM-DD'))}
                    onChange={(newValue) => {
                      setSelectedVisitDate(newValue);
                    }}
                    sx={{
                      margin: '10px',
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline':
                          {
                            borderColor: 'rgba(29, 177, 119, 0.5)', // 클릭되었을 때 테두리 색상
                          },
                      },
                      '& .MuiInputLabel-outlined.MuiInputLabel-shrink':
                        {
                          color: 'rgba(29, 177, 119, 0.5)', // 텍스트가 상단으로 이동할 때의 색상
                        },
                      '& .MuiButtonBase-root-MuiPickersDay-root': {
                        backgroundColor: 'green', // 선택된 날짜의 동그라미 색상
                        color: 'white', // 선택된 날짜의 텍스트 색상
                      },
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </div>
            <hr />
            <Button
              type="button"
              variant="contained"
              size="large"
              sx={{ width: '100px' }}
              onClick={() => {
                const requestData = {
                  kindnessRating,
                  tasteRating,
                  content: reviewContent,
                  visitDate: `${selectedVisitDate.$y}-${selectedVisitDate.$M + 1 >= 10 ? selectedVisitDate.$M + 1 : `0${selectedVisitDate.$M + 1}`}-${selectedVisitDate.$D >= 10 ? selectedVisitDate.$D : `0${selectedVisitDate.$D}`}`,
                  restaurantId: Number(restaurantId),
                  accountReviews: selectedAccountFriends,
                  reviewPersonTags: guestFriends,
                };

                setTimeout(() => {
                  setRefresh(!refresh);
                }, 5);
                navigate(`/main/restaurants/${restaurantId}`);
                const url = `${API_URL}/review/${loginAccount.id}`;
                axios
                  .post(url, requestData)
                  .then(() => {
                    // 성공 시 필요한 작업 수행
                    Swal.fire({
                      title: '저장 완료!',
                      text: '데이터가 성공적으로 저장되었습니다.',
                      icon: 'success',
                      confirmButtonText: '확인',
                      confirmButtonColor: '#1db177',
                    });
                  })
                  .catch(() => {
                    // 실패 시 에러 처리
                    Swal.fire({
                      title: '저장 실패!',
                      text: '데이터 저장에 실패하였습니다.',
                      icon: 'error',
                      confirmButtonText: '확인',
                      confirmButtonColor: '#1db177',
                    });
                  });
              }}
              style={{
                backgroundColor: 'rgba(29, 177, 119, 0.7)', // 버튼의 배경색을 1db177로 설정
                color: '#ffffff', // 버튼의 글자색을 흰색으로 설정
                fontSize: '1rem', // 버튼의 글자 크기를 조절
                padding: '5px 30px', // 버튼의 내부 여백을 조절
                borderRadius: '20px',
              }}
            >
              저장
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewRegistration;
