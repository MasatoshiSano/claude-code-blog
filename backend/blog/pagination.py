from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from collections import OrderedDict


class CustomPageNumberPagination(PageNumberPagination):
    """カスタムページネーション"""
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100
    
    def get_paginated_response(self, data):
        return Response(OrderedDict([
            ('count', self.page.paginator.count),
            ('next', self.get_next_link()),
            ('previous', self.get_previous_link()),
            ('page', self.page.number),
            ('page_size', self.page.paginator.per_page),
            ('total_pages', self.page.paginator.num_pages),
            ('results', data)
        ]))


class LargeResultsSetPagination(PageNumberPagination):
    """大きなデータセット用ページネーション"""
    page_size = 50
    page_size_query_param = 'page_size'
    max_page_size = 200


class SmallResultsSetPagination(PageNumberPagination):
    """小さなデータセット用ページネーション"""
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 50


class SearchResultsPagination(PageNumberPagination):
    """検索結果用ページネーション"""
    page_size = 15
    page_size_query_param = 'page_size'
    max_page_size = 100
    
    def get_paginated_response(self, data):
        return Response(OrderedDict([
            ('count', self.page.paginator.count),
            ('next', self.get_next_link()),
            ('previous', self.get_previous_link()),
            ('page', self.page.number),
            ('page_size', self.page.paginator.per_page),
            ('total_pages', self.page.paginator.num_pages),
            ('has_next', self.page.has_next()),
            ('has_previous', self.page.has_previous()),
            ('results', data)
        ]))