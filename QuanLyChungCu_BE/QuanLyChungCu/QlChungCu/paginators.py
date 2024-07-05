from rest_framework import pagination # pagination : Tối ưu nạp dữ liệu


class PeoplePaginator(pagination.PageNumberPagination):
    page_size = 2 # Phân trang thành 2
