import {
  IconButton,
  List,
  ListItem,
  ListItemText,
  Avatar,
  ListItemAvatar,
  Divider,
  Typography,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import StarIcon from '@mui/icons-material/Star';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import {
  Route,
  Routes,
  useNavigate,
  useParams,
  useLocation,
} from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
// import EditIcon from '@mui/icons-material/Edit';
import reviewStore from '../../stores/reviewStore';
import styles from '../../styles/reviews/ReviewList.module.css';
import ReviewsListSubItems from './ReviewListSubItems';
import urlStore from '../../stores/urlStore';
import userStore from '../../stores/userStore';
import reviewFilterStore from '../../stores/reviewFilterStore';

function ReviewsList() {
  const {
    restaurantStore,
    sortByVisitCount,
    sortByRecentVisitDate,
    sortByAverageTasteAndKindness,
  } = reviewStore();

  const { loginAccount } = userStore();
  const navigate = useNavigate();
  const location = useLocation();
  // 음식점 ID를 인자로 입력하면 해당 음식점으로 스크롤 이동한다
  const handleScrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const {
    setRestaurantStore,
    setMyReviewStore,
    refresh,
    setRefresh,
  } = reviewStore();
  // const [페이지공개여부, 페이지공개여부수정] = useState(false); 리뷰페이지 공개여부, 이건 나중에
  const { API_URL } = urlStore();
  const { userID } = useParams();
  const {
    selectedFriendID,
    selectedStartDate,
    selectedEndDate,
    selectedBusinessTypes,
    selectedUserLocationID,
    selectedGuestFriendIds,
    searchKeyWord,
    setSelectedFriendID,
    setSelectedStartDate,
    setSelectedEndDate,
    setSelectedBusinessTypes,
    setSelectedUserLocationID,
    setSelectedGuestFriendIds,
    setSearchKeyWord,
  } = reviewFilterStore();
  const [reviewListSortButton1, setReviewListSortButton1] =
    useState(true);
  const [reviewListSortButton2, setReviewListSortButton2] =
    useState(false);
  const [reviewListSortButton3, setReviewListSortButton3] =
    useState(false);
  const [selectedList, setSelectedList] = useState();
  useEffect(() => {
    const currentPageID =
      userID === undefined ? loginAccount?.id : userID;
    const fetchData = async () => {
      try {
        if (!currentPageID) {
          setRestaurantStore([]);
          setMyReviewStore([]);
          return;
        }
        const reviewResponseData = {
          accountReviews: selectedFriendID?.map((x) => ({
            id: Number(x),
          })),
          reviewPersonTags: selectedGuestFriendIds.map((x) => ({
            id: Number(x),
          })),
          restaurantFoodCategories: selectedBusinessTypes?.map(
            (x) => ({
              name: String(x),
            })
          ),
          regionId: Number(selectedUserLocationID),
          visitDate: `${selectedStartDate.format('YYYY-MM-DD')}-${selectedEndDate.format('YYYY-MM-DD')}`,
        };
        const restaurantResponseData = {
          name: String(searchKeyWord),
        };

        const [restaurantData, reviewData, regions] =
          await Promise.all([
            axios(
              searchKeyWord === ''
                ? {
                    method: 'get',
                    url: `${API_URL}/restaurant/v2/${currentPageID}`,
                  }
                : {
                    method: 'post',
                    url: `${API_URL}/review/search/simple/${currentPageID}`,
                    data: restaurantResponseData,
                  }
            ),
            axios({
              method: 'post',
              url: `${API_URL}/review/search/filter/${currentPageID} `,
              data: reviewResponseData,
            }),
            axios.get(`${API_URL}/region`),
          ]);

        setRestaurantStore([]);
        setMyReviewStore([]);

        const restaurantList = restaurantData.data?.map(
          (restaurant) => {
            const filteredRegeion = regions.data?.find(
              (region) => region.id === restaurant.regionId
            );
            const filteredReview = reviewData?.data.filter(
              (review) => review.restaurantId === restaurant.id
            );

            const totalKindnessRating = filteredReview?.reduce(
              (sum, review) => sum + review.kindnessRating,
              0
            );

            const averageKindnessRating =
              filteredReview?.length > 0
                ? totalKindnessRating / filteredReview.length
                : 0;
            const totalTasteRating = filteredReview?.reduce(
              (sum, review) => sum + review.tasteRating,
              0
            );

            const averageTasteRating =
              filteredReview?.length > 0
                ? totalTasteRating / filteredReview.length
                : 0;
            const latestVisitDate =
              filteredReview?.length > 0
                ? dayjs(
                    new Date(
                      Math.max.apply(
                        null,
                        filteredReview.map(
                          (review) => new Date(review.visitDate)
                        )
                      )
                    ).toISOString()
                  )
                : dayjs('2000-01-01'); // 날짜갱신
            return {
              id: restaurant.id,
              restaurantName: restaurant.name,
              locationName: filteredRegeion?.district,
              category: restaurant?.restaurantFoodCategories
                ?.map((x) => x.name)
                .join(' / '),
              kindnessRating: Math.round(averageKindnessRating),
              tasteRating: Math.round(averageTasteRating),
              recentVisitDate: latestVisitDate.format('YYYY-MM-DD'),
              visitCount: filteredReview.length,
              restaurantImage: restaurant?.thumUrl,
            };
          }
        );
        setRestaurantStore(restaurantList);
        const reviewList = reviewData?.data.map((review) => {
          const filteredRestaurant = restaurantList.find(
            (x) => Number(x.id) === Number(review.restaurantId)
          );
          return {
            id: review.restaurantId,
            reviewId: review.id,
            restaurantName: filteredRestaurant
              ? filteredRestaurant.restaurantName
              : '', // 일치하는 음식점에서 가게 이름 가져오기
            kindnessRating: review.kindnessRating,
            tasteRating: review.tasteRating,
            category: filteredRestaurant
              ? filteredRestaurant.category
              : '', // 일치하는 음식점에서 업종 가져오기
            content: review.content,
            imageUrl: filteredRestaurant?.thumUrl,
            companionFriends: review.accountReviews,
            guestFriends: review.reviewPersonTags,
            visitDate: review.visitDate,
            locationName: filteredRestaurant
              ? filteredRestaurant.locationName
              : '', // 일치하는 음식점에서 위치 가져오기
          };
        });
        setMyReviewStore(reviewList);
        if (reviewListSortButton1) sortByRecentVisitDate();
        if (reviewListSortButton2) sortByVisitCount();
        if (reviewListSortButton3) sortByAverageTasteAndKindness();
      } catch {
        setRestaurantStore([]);
        setMyReviewStore([]);
      }
    };
    fetchData();
  }, [
    location,
    loginAccount,
    selectedFriendID,
    selectedStartDate,
    selectedEndDate,
    selectedBusinessTypes,
    selectedUserLocationID,
    selectedGuestFriendIds,
    searchKeyWord,
    reviewListSortButton1,
    reviewListSortButton2,
    reviewListSortButton3,
  ]);

  return (
    <div>
      <div>
        <div className={styles.header}>
          <div className={styles.sortBtn}>
            <Button
              variant="text"
              onClick={() => {
                setReviewListSortButton1(true);
                setReviewListSortButton2(false);
                setReviewListSortButton3(false);
                sortByRecentVisitDate();
              }}
              sx={{
                color: reviewListSortButton1 ? '#555558' : '#BFBFBF',
              }}
            >
              • 최신순
            </Button>
            <Button
              variant="text"
              onClick={() => {
                setReviewListSortButton1(false);
                setReviewListSortButton2(true);
                setReviewListSortButton3(false);
                sortByVisitCount();
              }}
              sx={{
                color: reviewListSortButton2 ? '#555558' : '#BFBFBF',
              }}
            >
              • 방문순
            </Button>
            <Button
              variant="text"
              onClick={() => {
                setReviewListSortButton1(false);
                setReviewListSortButton2(false);
                setReviewListSortButton3(true);
                sortByAverageTasteAndKindness();
              }}
              sx={{
                color: reviewListSortButton3 ? '#555558' : '#BFBFBF',
              }}
            >
              • 별점순
            </Button>
          </div>
          <div>
            <IconButton
              onClick={() => {
                setRefresh(!refresh);
                setSelectedFriendID([]);
                setSelectedStartDate(
                  dayjs(dayjs('2024-01-01').format('YYYY-MM-DD'))
                );
                setSelectedEndDate(
                  dayjs(dayjs().format('YYYY-MM-DD'))
                );
                setSelectedBusinessTypes([]);
                setSelectedUserLocationID(undefined);
                setSelectedGuestFriendIds([]);
                setSearchKeyWord('');
              }}
            >
              <RefreshIcon />
            </IconButton>
            <IconButton onClick={() => handleScrollToSection(0)}>
              <ArrowUpwardIcon fontSize="small" />
            </IconButton>
            <IconButton
              onClick={() =>
                handleScrollToSection(restaurantStore.length - 1)
              }
            >
              <ArrowDownwardIcon fontSize="small" />
            </IconButton>
          </div>
        </div>

        <List className={styles.container}>
          {restaurantStore?.map((item, i) => (
            <ListItem
              key={restaurantStore[i].id}
              onClick={() => {
                navigate(`${item.id}/detail`, {
                  state: {
                    id: item.id,
                  },
                });
                setSelectedList(item.id);
              }}
              className={styles.content}
              button
              id={i}
            >
              <ListItemText
                className={`${styles.contentList} ${item.id === selectedList ? styles.selected : ''}`}
                primary={null}
                secondary={
                  <Typography component="div">
                    <ListItemAvatar>
                      <Avatar
                        src={restaurantStore[i]?.restaurantImage}
                        alt="사진"
                      />

                      {/* 사진 */}
                    </ListItemAvatar>
                    <span className={styles.itemInfo}>
                      <span className={styles.itemTitle}>
                        {restaurantStore[i]?.restaurantName}
                      </span>
                      <span>
                        <span>
                          친절
                          <StarIcon
                            sx={{
                              fontSize: '10px',
                              color: 'rgba(29, 177, 119, 0.7)',
                            }}
                          />
                          {restaurantStore[i].kindnessRating}
                        </span>
                        <span>|</span>
                        <span>
                          맛
                          <StarIcon
                            sx={{
                              fontSize: '10px',
                              color: 'rgba(29, 177, 119, 0.7)',
                            }}
                          />
                          {restaurantStore[i].tasteRating}
                        </span>
                      </span>
                    </span>
                    <span className={styles.itemInfo}>
                      <span>
                        <span>{restaurantStore[i].locationName}</span>
                        <span>|</span>
                        <span>{restaurantStore[i].category}</span>
                      </span>
                      <span>
                        <span>
                          {restaurantStore[i].visitCount}번 방문
                        </span>
                        {/* <span>|</span> */}
                        {/* <span>{restaurantStore[i].최근방문날짜}</span> */}
                      </span>
                    </span>
                  </Typography>
                }
              />

              <Divider />
              <Routes>
                <Route
                  path={`${item.id}/*`}
                  key={item.id}
                  element={<ReviewsListSubItems id={item.id} />}
                />
              </Routes>
            </ListItem>
          ))}
        </List>
      </div>
    </div>
  );
}
export default ReviewsList;
