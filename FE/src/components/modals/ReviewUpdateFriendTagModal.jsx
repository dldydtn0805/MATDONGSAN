import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import IconButton from '@mui/material/IconButton';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AddIcon from '@mui/icons-material/Add';
import dayjs from 'dayjs';
import styles from '../../styles/modals/ReviewUpdateFriendTagModal.module.css';

function ReviewWriteFriendAdd(props) {
  const {
    setReviewPersonTagsName,
    reviewPersonTagName,
    reviewPersonTagBirth,
    setReviewPersonTagBirth,
    reviewPerson,
    setReviewPerson,
    clickedButton,
    setClickedButton,
  } = props;
  return (
    <div>
      <div>
        <div className={styles.wrapper}>
          <TextField
            id="standard-basic"
            variant="outlined"
            size="small"
            placeholder="이름"
            autoComplete="off"
            sx={{
              margin: '10px',
              '& .MuiOutlinedInput-root': {
                height: '53px',
                '&.Mui-focused fieldset': {
                  borderColor: 'rgba(29, 177, 119, 0.5)',
                },
              },
            }}
            onChange={(e) => {
              setReviewPersonTagsName(e.target.value);
              console.log(reviewPersonTagName);
              console.log('임의 친구 추가중입니다');
            }}
            color="success"
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer
              sx={{
                '&::-webkit-scrollbar': {
                  display: 'none', // 스크롤바를 숨깁니다.
                },
              }}
              components={['DatePicker']}
            >
              <DatePicker
                views={['year']}
                openTo="year"
                size="small"
                label="생년"
                maxDate={dayjs(dayjs().format('YYYY-MM-DD'))}
                sx={{
                  '& .MuiInputBase-root': {
                    // 입력 텍스트 스타일을 조정하는 부분입니다.
                    width: '6.5vw', // 입력 텍스트 너비를 조절합니다.
                  },
                  '& .MuiStack-root': {
                    overflow: 'hidden', // 입력 텍스트 너비를 조절합니다.
                  },
                  margin: '10px',
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
                value={reviewPersonTagBirth}
                onChange={(newValue) => {
                  setReviewPersonTagBirth(newValue);
                  if (reviewPersonTagBirth)
                    console.log('시작 날짜 변경됨!', reviewPersonTagBirth.$y);
                }}
              />
            </DemoContainer>
          </LocalizationProvider>
          <IconButton
            onClick={() => {
              if (reviewPersonTagName && reviewPersonTagBirth) {
                console.log('임의친구추가버튼이 클릭되었습니다!');
                console.log(reviewPersonTagName, reviewPersonTagBirth.$y);
                const copy = [...reviewPerson];
                copy.push({
                  name: reviewPersonTagName,
                  birthYear: String(reviewPersonTagBirth.$y),
                });
                setReviewPersonTagsName('');
                setReviewPerson(copy);
                setClickedButton(!clickedButton);
              }
            }}
            sx={{
              margin: '10px',
            }}
          >
            <AddIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
}

export default ReviewWriteFriendAdd;
